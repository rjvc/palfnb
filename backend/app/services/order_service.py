from sqlmodel import select, func, desc
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import Session
from backend.app.models.order import Order, OrderItem
from backend.app.models.product import Product
from backend.app.models.notification import NotificationLog
from backend.app.services.stock_service import StockService
from backend.app.services.notification_service import NotificationService
from backend.app.websocket.manager import manager
from decimal import Decimal
from datetime import datetime, date

class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def create_order(self, mesa: int, cliente: str | None, observacoes: str | None, items_data: list[dict]) -> Order:
        order = Order(
            mesa=mesa,
            cliente=cliente,
            observacoes=observacoes,
            status="pendente",
            total=Decimal("0.00"),
        )
        self.db.add(order)
        self.db.flush()

        total = Decimal("0.00")
        for item in items_data:
            product = self.db.get(Product, item["product_id"])
            if not product or not product.ativo:
                continue
            qty = item["quantidade"]
            if product.stock < qty:
                qty = product.stock
            if qty <= 0:
                continue

            product.stock -= qty

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                produto_nome=product.nome,
                quantidade=qty,
                preco_unitario=product.preco,
            )
            self.db.add(order_item)
            total += product.preco * qty

            if product.stock <= product.stock_min:
                StockService.check_and_alert(self.db, product)

        order.total = total
        self.db.commit()
        self.db.refresh(order)

        manager.broadcast_cozinha({
            "tipo": "novo_pedido",
            "pedido": self._serialize_order(order),
        })
        manager.broadcast_dashboard({
            "tipo": "pedido_atualizado",
            "pedido_id": order.id,
            "status": order.status,
            "total": str(order.total),
        })

        return order

    def update_status(self, order_id: int, status: str) -> Order | None:
        order = self.db.get(Order, order_id)
        if not order:
            return None
        order.status = status
        order.atualizado_em = datetime.utcnow()
        self.db.commit()
        self.db.refresh(order)

        manager.broadcast_cozinha({
            "tipo": "status_pedido",
            "pedido_id": order.id,
            "status": order.status,
        })
        manager.broadcast_dashboard({
            "tipo": "pedido_atualizado",
            "pedido_id": order.id,
            "status": order.status,
        })

        return order

    def list_orders(self, status: str | None = None) -> list[Order]:
        query = select(Order).order_by(desc(Order.criado_em))
        if status:
            query = query.where(Order.status == status)
        return list(self.db.exec(query).all())

    def get_order(self, order_id: int) -> Order | None:
        return self.db.get(Order, order_id)

    def _serialize_order(self, order: Order) -> dict:
        return {
            "id": order.id,
            "mesa": order.mesa,
            "cliente": order.cliente,
            "status": order.status,
            "total": str(order.total),
            "observacoes": order.observacoes,
            "criado_em": order.criado_em.isoformat(),
            "items": [
                {
                    "id": i.id,
                    "product_id": i.product_id,
                    "produto_nome": i.produto_nome,
                    "quantidade": i.quantidade,
                    "preco_unitario": str(i.preco_unitario),
                }
                for i in order.items
            ],
        }
