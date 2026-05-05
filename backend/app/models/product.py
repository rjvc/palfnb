from sqlmodel import SQLModel, Field
from decimal import Decimal
from typing import Optional
from datetime import datetime

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=True)
    preco: Decimal = Field(max_digits=10, decimal_places=2)
    categoria: str = Field(default="Prato")
    stock: int = Field(default=0)
    stock_min: int = Field(default=5)
    imagem_url: Optional[str] = Field(default=None)
    ativo: bool = Field(default=True)
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
