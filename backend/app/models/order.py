from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    product_id: int = Field(foreign_key="product.id")
    produto_nome: str
    quantidade: int = Field(default=1)
    preco_unitario: Decimal = Field(max_digits=10, decimal_places=2)

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mesa: int = Field(default=0)
    cliente: Optional[str] = Field(default=None)
    status: str = Field(default="pendente")
    total: Decimal = Field(default=0, max_digits=10, decimal_places=2)
    observacoes: Optional[str] = Field(default=None)
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    items: List["OrderItem"] = Relationship(delete_all="all")
