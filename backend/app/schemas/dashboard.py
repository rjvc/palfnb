from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class SalesSummary(BaseModel):
    total_vendas: Decimal
    total_pedidos: int
    ticket_medio: Decimal

class TopProduct(BaseModel):
    produto_id: int
    nome: str
    quantidade: int
    total: Decimal

class StockAlert(BaseModel):
    produto_id: int
    nome: str
    stock_atual: int
    stock_min: int

class DashboardData(BaseModel):
    sales: SalesSummary
    top_products: List[TopProduct]
    stock_alerts: List[StockAlert]
    pedidos_pendentes: int
