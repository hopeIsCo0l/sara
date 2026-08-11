import asyncio
import os
import sys
from db.supabase_client import db

async def seed():
    print("[Seed] Seeding Supabase database for Sebrin Trading PLC...")
    if not db.client:
        print("[Seed] Error: Supabase client is not connected!")
        return

    # 1. Seed Categories
    categories_data = [
        {
            "name": "Solar Panels & Inverters",
            "slug": "solar-panels-inverters",
            "description": "High-efficiency Tier-1 monocrystalline solar panels and hybrid pure sine wave inverters.",
            "display_order": 1,
        },
        {
            "name": "Batteries & Charge Controllers",
            "slug": "solar-batteries-controllers",
            "description": "Deep cycle gel batteries, LiFePO4 lithium storage packs, and MPPT controllers.",
            "display_order": 2,
        },
    ]

    for cat in categories_data:
        try:
            db.client.table("categories").upsert(cat, on_conflict="slug").execute()
        except Exception as e:
            print(f"[Seed] Error seeding category {cat['slug']}: {e}")

    # Fetch inserted category IDs mapping
    cat_res = db.client.table("categories").select("id, slug").execute()
    cat_map = {row["slug"]: row["id"] for row in cat_res.data}
    print(f"[Seed] Categories mapped: {list(cat_map.keys())}")

    # 2. Seed Products
    products_data = [
        {
            "category_id": cat_map.get("solar-panels-inverters"),
            "name": "Jinko 550W N-Type Monocrystalline Solar Panel",
            "slug": "jinko-550w-n-type-monocrystalline-solar-panel",
            "sku": "SEB-SLR-550",
            "price": 18500,
            "currency": "ETB",
            "description": "Tier-1 ultra-high efficiency N-type TOPCon monocrystalline solar module with 22.5% module conversion efficiency.",
            "details": {"brand": "Jinko Solar", "power_output": "550W Peak", "warranty": "12-Year Product Warranty"},
            "is_featured": True,
            "is_visible": True,
            "stock_status": "in_stock",
            "image_url": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop",
        },
        {
            "category_id": cat_map.get("solar-panels-inverters"),
            "name": "Must 5.5kW Hybrid Pure Sine Wave Solar Inverter (48V)",
            "slug": "must-55kw-hybrid-pure-sine-wave-solar-inverter-48v",
            "sku": "SEB-INV-5500",
            "price": 95000,
            "currency": "ETB",
            "description": "Multi-function 5500W 48V hybrid inverter combining functions of pure sine wave inverter and 100A MPPT controller.",
            "details": {"brand": "Must Power Systems", "power_output": "5500W Continuous", "warranty": "2-Year Warranty"},
            "is_featured": True,
            "is_visible": True,
            "stock_status": "in_stock",
            "image_url": "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1000&auto=format&fit=crop",
        },
        {
            "category_id": cat_map.get("solar-batteries-controllers"),
            "name": "Felicity 51.2V 100Ah 5kWh LiFePO4 Lithium Battery Pack",
            "slug": "felicity-512v-100ah-5kwh-lifepo4-lithium-battery-pack",
            "sku": "SEB-BAT-5KWH",
            "price": 165000,
            "currency": "ETB",
            "description": "Wall-mounted 5.12kWh Lithium Iron Phosphate (LiFePO4) solar energy storage pack with smart BMS protection.",
            "details": {"brand": "Felicity Solar", "capacity": "5.12 kWh", "warranty": "5-Year Warranty"},
            "is_featured": True,
            "is_visible": True,
            "stock_status": "in_stock",
            "image_url": "https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=1000&auto=format&fit=crop",
        },
        {
            "category_id": cat_map.get("solar-batteries-controllers"),
            "name": "Sebrin Power 200Ah 12V Maintenance-Free Gel Deep Cycle Battery",
            "slug": "sebrin-power-200ah-12v-maintenance-free-gel-deep-cycle-battery",
            "sku": "SEB-BAT-200GEL",
            "price": 38000,
            "currency": "ETB",
            "description": "Heavy-duty 12V 200Ah valve-regulated sealed lead-gel battery for solar backup and UPS systems.",
            "details": {"brand": "Sebrin Power Tech", "capacity": "200Ah", "warranty": "2-Year Warranty"},
            "is_featured": False,
            "is_visible": True,
            "stock_status": "in_stock",
            "image_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop",
        },
    ]

    for p in products_data:
        try:
            img_url = p.pop("image_url")
            res = db.client.table("products").upsert(p, on_conflict="slug").execute()
            if res.data and len(res.data) > 0:
                prod_id = res.data[0]["id"]
                db.client.table("product_images").upsert({
                    "product_id": prod_id,
                    "url": img_url,
                    "is_primary": True,
                    "display_order": 0
                }).execute()
        except Exception as e:
            print(f"[Seed] Error seeding product {p['slug']}: {e}")

    # 3. Seed Services
    services_data = [
        {
            "title": "Turnkey Solar Power System Sizing & Installation",
            "slug": "turnkey-solar-power-system-sizing-installation",
            "subtitle": "Commercial, industrial & residential solar design from roof assessment to inverter commissioning.",
            "description": "Sebrin Trading PLC provides full technical assessment, load calculation, solar array mounting, high-capacity inverter configuration, and lithium battery storage installation across Ethiopia.",
            "specifications": ["Site Load & Solar Irradiance Analysis", "Tier-1 Panel Mounting", "Inverter & Lithium Battery Commissioning"],
            "price_range": "Custom Quote",
            "display_order": 1
        },
    ]

    for srv in services_data:
        try:
            db.client.table("services").upsert(srv, on_conflict="slug").execute()
        except Exception as e:
            print(f"[Seed] Error seeding service {srv['slug']}: {e}")

    print("[Seed] Supabase Database Seeded Successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
