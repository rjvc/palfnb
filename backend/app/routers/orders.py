from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend.app.database import get_session
from backend.app.schemas.order import OrderCreate, OrderRead, OrderStatusUpdate
from backend.app.schemas.order import OrderItemRead
from backend.app.services.order_service import OrderService

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.get("", response_model=list[OrderRead])
def list_orders(status: str | None = None, db: Session = Depends(get_session)):
    service = OrderService(db)
    return service.list_orders(status)

@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, db: Session = Depends(get_session)):
    service = OrderService(db)
    order = service.get_order(order_id)
    if not order:
        raise HTTPException(404, "Pedido não encontrado")
    return order

@router.post("", response_model=OrderRead, status_code=201)
def create_order(data: OrderCreate, db: Session = Depends(get_session)):
    service = OrderService(db)
    return service.create_order(
        mesa=data.mesa,
        cliente=data.cliente,
        observacoes=data.observacoes,
        items_data=[i.model_dump() for i in data.items],
    )

@router.patch("/{order_id}/status", response_model=OrderRead)
def update_order_status(order_id: int, data: OrderStatusUpdate, db: Session = Depends(get_session)):
    service = OrderService(db)
    order = service.update_status(order_id, data.status)
    if not order:
        raise HTTPException(404, "Pedido não encontrado")
    return order
