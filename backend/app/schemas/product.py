from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class ProductBase(BaseModel):
    nome: str
    preco: Decimal
    categoria: str = "Prato"
    stock: int = 0
    stock_min: int = 5
    imagem_url: Optional[str] = None
    ativo: bool = True

class ProductCreate(ProductBase):
    pass

class ProductRead(ProductBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    model_config = {"from_attributes": True}

class ProductUpdate(BaseModel):
    nome: Optional[str] = None
    preco: Optional[Decimal] = None
    categoria: Optional[str] = None
    stock: Optional[int] = None
    stock_min: Optional[int] = None
    imagem_url: Optional[str] = None
    ativo: Optional[bool] = None
