#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create individual databases for each microservice
    CREATE DATABASE patient_db;
    CREATE DATABASE appointment_db;
    CREATE DATABASE clinical_notes_db;
    CREATE DATABASE billing_db;
    
    -- Create users for each service (optional, can use main postgres user)
    CREATE USER patient_user WITH ENCRYPTED PASSWORD 'patient_pass';
    CREATE USER appointment_user WITH ENCRYPTED PASSWORD 'appointment_pass';
    CREATE USER clinical_user WITH ENCRYPTED PASSWORD 'clinical_pass';
    CREATE USER billing_user WITH ENCRYPTED PASSWORD 'billing_pass';
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE patient_db TO patient_user;
    GRANT ALL PRIVILEGES ON DATABASE appointment_db TO appointment_user;
    GRANT ALL PRIVILEGES ON DATABASE clinical_notes_db TO clinical_user;
    GRANT ALL PRIVILEGES ON DATABASE billing_db TO billing_user;
    
    -- Also grant to main postgres user for admin access
    GRANT ALL PRIVILEGES ON DATABASE patient_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE appointment_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE clinical_notes_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE billing_db TO postgres;
EOSQL

echo "All databases created successfully!"
