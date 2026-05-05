from fastapi import APIRouter, Depends
from sqlmodel import Session
from backend.app.database import get_session
from backend.app.services.notification_service import NotificationService
from pydantic import BaseModel

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

class WhatsAppSend(BaseModel):
    destinatario: str = "+244900000000"
    mensagem: str

@router.post("/send")
def send_whatsapp(data: WhatsAppSend, db: Session = Depends(get_session)):
    alert = NotificationService.create_alert(
        db=db,
        tipo="whatsapp_simulado",
        mensagem=f"[WhatsApp Simulado] Para: {data.destinatario} — {data.mensagem}",
    )
    return {"status": "simulado", "id": alert.id, "mensagem": "Alerta WhatsApp registado (demo)"}

@router.get("/logs")
def list_whatsapp_logs(db: Session = Depends(get_session)):
    return NotificationService.get_alerts(db)
