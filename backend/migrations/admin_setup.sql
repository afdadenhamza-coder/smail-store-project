-- Migration: Add click_events table for admin analytics
-- Run this against your PostgreSQL database:
--   psql -U smailstore_user -d smailstore -f admin_setup.sql

CREATE TABLE IF NOT EXISTS click_events (
    id BIGSERIAL PRIMARY KEY,
    path VARCHAR(500) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    country VARCHAR(2),
    city VARCHAR(255),
    is_vpn BOOLEAN NOT NULL DEFAULT FALSE,
    is_valid BOOLEAN NOT NULL DEFAULT FALSE,
    session_id VARCHAR(36),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for date-range queries (dashboard stats)
CREATE INDEX IF NOT EXISTS idx_click_events_created_at ON click_events (created_at DESC);

-- Index for filtering valid clicks
CREATE INDEX IF NOT EXISTS idx_click_events_is_valid ON click_events (is_valid) WHERE is_valid = TRUE;

-- Index for country filtering
CREATE INDEX IF NOT EXISTS idx_click_events_country ON click_events (country);

-- Index for session tracking
CREATE INDEX IF NOT EXISTS idx_click_events_session ON click_events (session_id);

-- Order status index for faster filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status) WHERE status IS NOT NULL;

-- Order date index
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
