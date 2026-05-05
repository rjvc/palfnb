def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

def test_create_product(client):
    r = client.post("/api/products", json={
        "nome": "Frango Grelhado",
        "preco": 2500.00,
        "categoria": "Prato",
        "stock": 20,
        "stock_min": 5,
    })
    assert r.status_code == 201
    data = r.json()
    assert data["nome"] == "Frango Grelhado"
    assert data["preco"] == 2500.00

def test_list_products(client):
    client.post("/api/products", json={"nome": "Coca-Cola", "preco": 500, "categoria": "Bebida", "stock": 50})
    client.post("/api/products", json={"nome": "Sumo Natural", "preco": 600, "categoria": "Bebida", "stock": 40})
    r = client.get("/api/products")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 2

def test_get_product_not_found(client):
    r = client.get("/api/products/999")
    assert r.status_code == 404

def test_update_product(client):
    r = client.post("/api/products", json={"nome": "Hambúrguer", "preco": 2000, "categoria": "Prato", "stock": 10})
    pid = r.json()["id"]
    r = client.put(f"/api/products/{pid}", json={"preco": 2200, "stock": 15})
    assert r.status_code == 200
    assert r.json()["preco"] == 2200
    assert r.json()["stock"] == 15

def test_delete_product(client):
    r = client.post("/api/products", json={"nome": "Sobremesa", "preco": 800, "categoria": "Sobremesa", "stock": 5})
    pid = r.json()["id"]
    r = client.delete(f"/api/products/{pid}")
    assert r.status_code == 204
    r = client.get(f"/api/products/{pid}")
    assert r.status_code == 404

def test_create_order(client):
    r = client.post("/api/products", json={"nome": "Frango", "preco": 2500, "categoria": "Prato", "stock": 10})
    pid = r.json()["id"]
    r = client.post("/api/orders", json={
        "mesa": 5,
        "cliente": "João",
        "items": [{"product_id": pid, "quantidade": 2}]
    })
    assert r.status_code == 201
    data = r.json()
    assert data["mesa"] == 5
    assert data["cliente"] == "João"
    assert data["status"] == "pendente"
    assert len(data["items"]) == 1

def test_create_order_deducts_stock(client):
    r = client.post("/api/products", json={"nome": "Coca", "preco": 500, "categoria": "Bebida", "stock": 5})
    pid = r.json()["id"]
    client.post("/api/orders", json={"mesa": 1, "items": [{"product_id": pid, "quantidade": 3}]})
    r = client.get(f"/api/products/{pid}")
    assert r.json()["stock"] == 2

def test_list_orders_filter(client):
    r = client.post("/api/products", json={"nome": "Pizza", "preco": 3000, "categoria": "Prato", "stock": 5})
    pid = r.json()["id"]
    client.post("/api/orders", json={"mesa": 1, "items": [{"product_id": pid, "quantidade": 1}]})
    r = client.get("/api/orders?status=pendente")
    assert r.status_code == 200
    assert len(r.json()) > 0

def test_update_order_status(client):
    r = client.post("/api/products", json={"nome": "Salada", "preco": 1800, "categoria": "Entrada", "stock": 10})
    pid = r.json()["id"]
    r = client.post("/api/orders", json={"mesa": 2, "items": [{"product_id": pid, "quantidade": 1}]})
    oid = r.json()["id"]
    r = client.patch(f"/api/orders/{oid}/status", json={"status": "pronto"})
    assert r.status_code == 200
    assert r.json()["status"] == "pronto"

def test_dashboard(client):
    r = client.get("/api/dashboard/today")
    assert r.status_code == 200
    data = r.json()
    assert "sales" in data
    assert "top_products" in data
    assert "stock_alerts" in data
    assert "pedidos_pendentes" in data

def test_whatsapp_send(client):
    r = client.post("/api/whatsapp/send", json={
        "destinatario": "+244900000000",
        "mensagem": "Teste de alerta"
    })
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "simulado"

def test_whatsapp_logs(client):
    r = client.get("/api/whatsapp/logs")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
