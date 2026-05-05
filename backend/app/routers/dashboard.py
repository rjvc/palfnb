from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func, desc
from backend.app.database import get_session
from backend.app.models.order import Order, OrderItem
from backend.app.models.product import Product
from backend.app.models.notification import NotificationLog
from backend.app.schemas.dashboard import DashboardData, SalesSummary, TopProduct, StockAlert
from decimal import Decimal
from datetime import datetime, date

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/today", response_model=DashboardData)
def get_dashboard(db: Session = Depends(get_session)):
    hoje = date.today()
    inicio_hoje = datetime(hoje.year, hoje.month, hoje.day, 0, 0, 0)

    orders = db.exec(
        select(Order).where(Order.criado_em >= inicio_hoje)
    ).all()

    total_vendas = sum((o.total for o in orders if o.status != "cancelado"), Decimal("0.00"))
    total_pedidos = len([o for o in orders if o.status != "cancelado"])
    ticket_medio = total_vendas / total_pedidos if total_pedidos > 0 else Decimal("0.00")

    top_items = db.exec(
        select(
            OrderItem.product_id,
            OrderItem.produto_nome,
            func.sum(OrderItem.quantidade).label("qtd"),
            func.sum(OrderItem.preco_unitario * OrderItem.quantidade).label("total"),
        )
        .select_from(OrderItem)
        .join(Order)
        .where(Order.criado_em >= inicio_hoje, Order.status != "cancelado")
        .group_by(OrderItem.product_id)
        .order_by(desc("qtd"))
        .limit(5)
    ).all()

    low_stock = db.exec(
        select(Product).where(Product.stock <= Product.stock_min, Product.ativo == True)
    ).all()

    pendentes = len(db.exec(
        select(Order).where(Order.status == "pendente")
    ).all())

    return DashboardData(
        sales=SalesSummary(
            total_vendas=total_vendas,
            total_pedidos=total_pedidos,
            ticket_medio=ticket_medio,
        ),
        top_products=[
            TopProduct(produto_id=row[0], nome=row[1], quantidade=row[2], total=row[3] or Decimal("0.00"))
            for row in top_items
        ],
        stock_alerts=[
            StockAlert(produto_id=p.id, nome=p.nome, stock_atual=p.stock, stock_min=p.stock_min)
            for p in low_stock
        ],
        pedidos_pendentes=pendentes,
    )

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_session)):
    from backend.app.services.notification_service import NotificationService
    return NotificationService.get_alerts(db, lido=False)
