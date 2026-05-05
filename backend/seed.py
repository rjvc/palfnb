from backend.app.database import init_db, engine
from sqlmodel import Session, select
from backend.app.models.product import Product
from decimal import Decimal

def seed():
    init_db()
    with Session(engine) as db:
        existing = len(db.exec(select(Product)).all())
        if existing > 0:
            print("Database already seeded. Skipping.")
            return

        products = [
            Product(nome="Frango Grelhado", preco=Decimal("2500.00"), categoria="Prato", stock=20, stock_min=5),
            Product(nome="Prego no Prato", preco=Decimal("2200.00"), categoria="Prato", stock=15, stock_min=5),
            Product(nome="Bacalhau à Brás", preco=Decimal("3500.00"), categoria="Prato", stock=10, stock_min=3),
            Product(nome="Lasanha Bolonhesa", preco=Decimal("2800.00"), categoria="Prato", stock=12, stock_min=4),
            Product(nome="Hambúrguer Artesanal", preco=Decimal("2000.00"), categoria="Prato", stock=18, stock_min=5),
            Product(nome="Salada Caesar", preco=Decimal("1800.00"), categoria="Entrada", stock=25, stock_min=5),
            Product(nome="Bruschetta", preco=Decimal("1500.00"), categoria="Entrada", stock=20, stock_min=5),
            Product(nome="Coca-Cola", preco=Decimal("500.00"), categoria="Bebida", stock=50, stock_min=10),
            Product(nome="Sumo Natural", preco=Decimal("600.00"), categoria="Bebida", stock=40, stock_min=8),
            Product(nome="Água Mineral", preco=Decimal("300.00"), categoria="Bebida", stock=60, stock_min=15),
            Product(nome="Café Expresso", preco=Decimal("400.00"), categoria="Bebida", stock=30, stock_min=10),
            Product(nome="Mousse de Chocolate", preco=Decimal("800.00"), categoria="Sobremesa", stock=15, stock_min=5),
            Product(nome="Pudim", preco=Decimal("700.00"), categoria="Sobremesa", stock=12, stock_min=4),
            Product(nome="Frango Grelhado", preco=Decimal("0.01"), categoria="Stock Baixo", stock=2, stock_min=5),
        ]
        for p in products:
            db.add(p)
        db.commit()
        print(f"Seeded {len(products)} products.")

if __name__ == "__main__":
    seed()
