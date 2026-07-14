"""Debug the PUT /api/admin/products/{id} endpoint"""
import requests
import json
import sys

BASE = "http://localhost:8000"

sys.stdout.reconfigure(encoding="utf-8")

# Login
r = requests.post(f"{BASE}/api/admin/login", json={"email": "admin@smailstore.shop", "password": "admin123"})
token = r.json()["token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Get products
r = requests.get(f"{BASE}/api/admin/products", headers=headers)
products = r.json()
print(f"Got {len(products)} products")

# Pick a product by index that has no arabic in name
target = None
for p in products:
    if all(ord(c) < 128 for c in p["name"]):
        target = p
        break

if target is None:
    target = products[0]

pid = target["id"]
name_clean = target["name"].encode("ascii", "replace").decode()
print(f"Editing: {name_clean} (id={pid})")

# Replicate frontend form data
payload = {
    "name": target["name"],
    "slug": target["slug"],
    "description": "",
    "price": float(target["price"]),
    "offer_price": float(target["offer_price"]) if target.get("offer_price") else None,
    "has_offer": target.get("has_offer", False),
    "images": target.get("images", []),
    "sizes": ["S", "M", "L", "XL"],
    "category": target.get("category", ""),
    "is_active": True,
    "is_featured": target.get("is_featured", False),
    "is_upsell": target.get("is_upsell", False),
    "rating": 5.0,
    "reviews_count": 0,
}

print(f"Sending PUT...")
try:
    r = requests.put(f"{BASE}/api/admin/products/{pid}", headers=headers, json=payload)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:500]}")
    if r.status_code == 200:
        print("SUCCESS!")
except Exception as e:
    print(f"Error: {e}")
