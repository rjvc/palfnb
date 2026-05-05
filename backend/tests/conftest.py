import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from backend.app.main import app
from backend.app.database import get_session

TEST_DB_URL = "sqlite:///./test_demo.db"

@pytest.fixture
def engine():
    engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

@pytest.fixture
def session(engine):
    with Session(engine) as session:
        yield session

@pytest.fixture
def client(engine):
    def override_get_session():
        with Session(engine) as session:
            yield session
    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
