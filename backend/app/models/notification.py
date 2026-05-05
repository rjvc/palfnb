from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class NotificationLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tipo: str = Field(default="stock_baixo")
    mensagem: str
    produto_id: Optional[int] = Field(default=None)
    produto_nome: Optional[str] = Field(default=None)
    whatsapp_simulado: bool = Field(default=True)
    lido: bool = Field(default=False)
    criado_em: datetime = Field(default_factory=datetime.utcnow)
