from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = f"sqlite:///{BASE_DIR}/database.db"
DATABASE_PATH = BASE_DIR / "database.db"
WS_HEARTBEAT_INTERVAL = 30
STOCK_MIN_THRESHOLD = 5
WHATSAPP_SIMULATED_DELAY = 2
