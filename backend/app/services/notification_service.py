from sqlmodel import Session, select, desc
from backend.app.models.notification import NotificationLog

class NotificationService:
    @staticmethod
    def get_alerts(db: Session, lido: bool | None = None) -> list[NotificationLog]:
        query = select(NotificationLog).order_by(desc(NotificationLog.criado_em))
        if lido is not None:
            query = query.where(NotificationLog.lido == lido)
        return list(db.exec(query).all())

    @staticmethod
    def mark_read(db: Session, alert_id: int) -> NotificationLog | None:
        alert = db.get(NotificationLog, alert_id)
        if not alert:
            return None
        alert.lido = True
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def create_alert(db: Session, tipo: str, mensagem: str, produto_id: int | None = None, produto_nome: str | None = None) -> NotificationLog:
        alert = NotificationLog(
            tipo=tipo,
            mensagem=mensagem,
            produto_id=produto_id,
            produto_nome=produto_nome,
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert
