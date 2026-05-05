from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class OrderItemCreate(BaseModel):
    product_id: int
    quantidade: int = 1

class OrderItemRead(BaseModel):
    id: int
    product_id: int
    produto_nome: str
    quantidade: int
    preco_unitario: Decimal

    model_config = {"from_attributes": True}

class OrderCreate(BaseModel):
    mesa: int = 0
    cliente: Optional[str] = None
    observacoes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderRead(BaseModel):
    id: int
    mesa: int
    cliente: Optional[str]
    status: str
    total: Decimal
    observacoes: Optional[str]
    criado_em: datetime
    atualizado_em: datetime
    items: List[OrderItemRead] = []

    model_config = {"from_attributes": True}

class OrderStatusUpdate(BaseModel):
    status: str
