from sqlmodel import Session, select
from backend.app.models.product import Product
from backend.app.models.notification import NotificationLog

class StockService:
    @staticmethod
    def check_and_alert(db: Session, product: Product):
        if product.stock <= product.stock_min:
            existing = db.exec(
                select(NotificationLog).where(
                    NotificationLog.produto_id == product.id,
                    NotificationLog.lido == False,
                    NotificationLog.tipo == "stock_baixo",
                )
            ).first()
            if not existing:
                notification = NotificationLog(
                    tipo="stock_baixo",
                    mensagem=f"Stock baixo: {product.nome} tem apenas {product.stock} unidades (mínimo: {product.stock_min})",
                    produto_id=product.id,
                    produto_nome=product.nome,
                    whatsapp_simulado=True,
                )
                db.add(notification)
                db.commit()

    @staticmethod
    def get_low_stock_products(db: Session) -> list[Product]:
        products = db.exec(select(Product).where(Product.stock <= Product.stock_min, Product.ativo == True)).all()
        return list(products)
