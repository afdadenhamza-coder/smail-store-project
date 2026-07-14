import requests, json, sys
sys.stdout.reconfigure(encoding="utf-8")
BASE = "http://localhost:8000"
r = requests.post(BASE+"/api/admin/login", json={"email":"admin@smailstore.shop","password":"admin123"})
token = r.json()["token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
r = requests.get(BASE+"/api/admin/products", headers=headers)
products = r.json()
for p in products:
    name = p["name"][:30]
    rating = p.get("rating", 0)
    sizes = str(p.get("sizes", ""))
    has_desc = str(p.get("description") is not None)
    print(f"{name:30s} rating={rating} sizes={sizes[:20]} has_desc={has_desc}")
