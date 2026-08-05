-- =====================================================================
-- KITH-Style Product Catalog & Service Showcase Database Schema
-- Database: PostgreSQL (Supabase)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE stock_status_enum AS ENUM ('in_stock', 'low_stock', 'preorder', 'sold_out');
CREATE TYPE admin_role_enum AS ENUM ('super_admin', 'editor');

-- 3. TABLES

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    sku VARCHAR(100) UNIQUE,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb, -- e.g. {"material": "100% Heavyweight Cotton", "fit": "Boxy/Relaxed", "weight": "450 GSM"}
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    stock_status stock_status_enum DEFAULT 'in_stock',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Showcase Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    specifications JSONB DEFAULT '[]'::jsonb, -- e.g. ["Custom Sizing & Patterning", "Sample Prototyping", "Batch Dyeing"]
    price_range VARCHAR(100), -- e.g. "$1,500 - $5,000" or "On Request"
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Telegram Bot Admins Table
CREATE TABLE IF NOT EXISTS telegram_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150),
    username VARCHAR(100),
    role admin_role_enum DEFAULT 'editor',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- 5. TRIGGER FOR UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_admins ENABLE ROW LEVEL SECURITY;

-- Public Read-Only Access
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public visible products are viewable by everyone" ON products FOR SELECT USING (is_visible = true);
CREATE POLICY "Public product images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public active services are viewable by everyone" ON services FOR SELECT USING (is_active = true);

-- Service Role / Admin Full Access (Used by Python Bot Service Role Key)
CREATE POLICY "Service role full access on categories" ON categories USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on products" ON products USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on product_images" ON product_images USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on services" ON services USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on telegram_admins" ON telegram_admins USING (true) WITH CHECK (true);

-- 7. SEED DATA (FOR SEBRIN TRADING PLC - SOLAR & SOUND EQUIPMENT)
INSERT INTO categories (name, slug, description, display_order) VALUES
('Solar Panels & Inverters', 'solar-panels-inverters', 'High-efficiency Tier-1 monocrystalline solar panels and hybrid pure sine wave inverters.', 1),
('Batteries & Charge Controllers', 'solar-batteries-controllers', 'Deep cycle gel batteries, LiFePO4 lithium storage packs, and MPPT controllers.', 2),
('Professional Speakers & PA Systems', 'pro-speakers-pa', 'Commercial loudspeakers, stage monitors, subwoofers, and PA line arrays.', 3),
('Amplifiers & Audio Mixers', 'amplifiers-audio', 'High-power audio amplifiers, multi-channel sound mixers, and wireless mic systems.', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (title, slug, subtitle, description, specifications, price_range, display_order) VALUES
('Turnkey Solar Power System Sizing & Installation', 'turnkey-solar-power-system-sizing-installation', 'Commercial, industrial & residential solar design from roof assessment to inverter commissioning.', 'Sebrin Trading PLC provides full technical assessment, load calculation, solar array mounting, high-capacity inverter configuration, and lithium battery storage installation for uninterrupted power supply across Ethiopia.', '["Site Load & Solar Irradiance Analysis", "Tier-1 Monocrystalline Panel Mounting", "Hybrid Inverter & Lithium Battery Commissioning", "Surge Protection & Safety Disconnect Installation"]'::jsonb, 'Custom Quote', 1),
('Commercial Sound System & Acoustic Engineering Setup', 'commercial-sound-system-acoustic-engineering-setup', 'Professional audio system installation for auditoriums, churches, venues, and commercial spaces.', 'End-to-end sound system design including loudspeaker placement modeling, active mixer tuning, UHF wireless microphone distribution, and power amplifier impedance matching for crystal-clear acoustics.', '["Venue Acoustic Measurement & Speaker Placement", "Powered Speaker & Subwoofer Array Tuning", "Multi-Channel Audio Console Calibration", "Wireless UHF Microphone Frequency Scan"]'::jsonb, 'Custom Quote', 2),
('Solar Battery Bank & Inverter Maintenance & Upgrades', 'solar-battery-bank-inverter-maintenance-upgrades', 'Preventative maintenance, battery health diagnostics, and capacity upgrades for existing solar systems.', 'Diagnose degraded battery banks, calibrate MPPT charging profiles, upgrade lead-gel systems to high-efficiency LiFePO4 lithium batteries, and ensure 24/7 power availability.', '["Battery State of Health Diagnostic Testing", "Gel-to-Lithium Battery Retrofit & BMS Configuration", "Inverter Firmware Flash & Solar Calibration", "Emergency Backup Transfer Switch Testing"]'::jsonb, 'Custom Quote', 3)
ON CONFLICT (slug) DO NOTHING;
