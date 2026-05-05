# palfnb - Palestra F&B 4.0

Sistema de demonstração GestiFácil para gestão de restaurantes.

## Setup

```bash
# Backend
pip install -r backend/requirements.txt
python backend/seed.py    # popular dados de demonstração
python backend/run.py     # iniciar servidor em http://localhost:8000
```

## Ecrãs

- `/` - Pedidos (tablet garçom)
- `/cozinha` - Fila de pedidos tempo real (WebSocket)
- `/dashboard` - Dashboard gestor

## Testes

```bash
pytest backend/tests/ -v
```
