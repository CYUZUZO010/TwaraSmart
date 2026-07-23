CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','ON_DUTY','OFF_DUTY')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    plate_number VARCHAR(30) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TRUCK','VAN','BIKE')),
    capacity_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'IDLE' CHECK (status IN ('ACTIVE','MAINTENANCE','IDLE')),
    driver_id BIGINT REFERENCES drivers(id) ON DELETE SET NULL,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE warehouses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    capacity_units INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE inventory_items (
    id BIGSERIAL PRIMARY KEY,
    warehouse_id BIGINT NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(warehouse_id, sku)
);

CREATE TABLE shipments (
    id BIGSERIAL PRIMARY KEY,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    destination_lat DOUBLE PRECISION,
    destination_lng DOUBLE PRECISION,
    vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id BIGINT REFERENCES drivers(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','IN_TRANSIT','DELIVERED','DELAYED')),
    distance_km NUMERIC(10,2),
    avg_speed_kmh NUMERIC(6,2) NOT NULL DEFAULT 40,
    eta TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    delivered_at TIMESTAMP
);

CREATE TABLE fuel_logs (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    liters NUMERIC(8,2) NOT NULL,
    cost NUMERIC(10,2) NOT NULL,
    odometer_km NUMERIC(10,2) NOT NULL,
    logged_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_inventory_warehouse ON inventory_items(warehouse_id);
CREATE INDEX idx_fuel_logs_vehicle ON fuel_logs(vehicle_id);
