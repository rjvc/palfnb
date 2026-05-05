from fastapi import WebSocket
from typing import Set
import json

class ConnectionManager:
    def __init__(self):
        self.cozinha: Set[WebSocket] = set()
        self.dashboard: Set[WebSocket] = set()

    async def connect_cozinha(self, websocket: WebSocket):
        await websocket.accept()
        self.cozinha.add(websocket)

    async def connect_dashboard(self, websocket: WebSocket):
        await websocket.accept()
        self.dashboard.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.cozinha.discard(websocket)
        self.dashboard.discard(websocket)

    async def broadcast_cozinha(self, message: dict):
        dead = set()
        for ws in self.cozinha:
            try:
                await ws.send_json(message)
            except Exception:
                dead.add(ws)
        self.cozinha -= dead

    async def broadcast_dashboard(self, message: dict):
        dead = set()
        for ws in self.dashboard:
            try:
                await ws.send_json(message)
            except Exception:
                dead.add(ws)
        self.dashboard -= dead

manager = ConnectionManager()
