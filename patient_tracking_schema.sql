-- Sample SQL schema for patient-tracking application
-----------------------------------------------------

-- =========================
-- Core entity tables
-- =========================

-- Table: hospitals
CREATE TABLE hospitals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    location    TEXT
);

-- Table: floors
CREATE TABLE floors (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    floor_number INTEGER NOT NULL,
    description TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Table: physicians
CREATE TABLE physicians (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    specialty TEXT
);

-- Table: patients
CREATE TABLE patients (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    name                   TEXT NOT NULL,
    birthdate              DATE,
    medical_issue          TEXT,
    hospital_id            INTEGER,
    floor_id               INTEGER,
    attending_physician_id INTEGER,
    notes                  TEXT,
    FOREIGN KEY (hospital_id)            REFERENCES hospitals(id),
    FOREIGN KEY (floor_id)               REFERENCES floors(id),
    FOREIGN KEY (attending_physician_id) REFERENCES physicians(id)
);

-- Table: attachments
CREATE TABLE attachments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id  INTEGER NOT NULL,
    file_path   TEXT NOT NULL,
    description TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- =========================
-- Helpful indices
-- =========================
CREATE INDEX idx_patients_hospital  ON patients(hospital_id);
CREATE INDEX idx_patients_floor     ON patients(floor_id);
CREATE INDEX idx_patients_physician ON patients(attending_physician_id);

-- =========================
-- Audit log + triggers
-- =========================

CREATE TABLE audit_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name  TEXT NOT NULL,
    operation   TEXT NOT NULL,          -- INSERT / UPDATE / DELETE
    row_id      INTEGER,                -- PK of the affected row
    changed_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    changed_data TEXT                   -- JSON payload of NEW values (if applicable)
);

-- ----- Hospitals
CREATE TRIGGER trg_hospitals_ai AFTER INSERT ON hospitals
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('hospitals', 'INSERT', NEW.id,
            json_object('name', NEW.name, 'location', NEW.location));
END;

CREATE TRIGGER trg_hospitals_au AFTER UPDATE ON hospitals
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('hospitals', 'UPDATE', NEW.id,
            json_object('name', NEW.name, 'location', NEW.location));
END;

CREATE TRIGGER trg_hospitals_ad AFTER DELETE ON hospitals
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('hospitals', 'DELETE', OLD.id);
END;

-- ----- Floors
CREATE TRIGGER trg_floors_ai AFTER INSERT ON floors
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('floors', 'INSERT', NEW.id,
            json_object('hospital_id', NEW.hospital_id,
                        'floor_number', NEW.floor_number,
                        'description', NEW.description));
END;

CREATE TRIGGER trg_floors_au AFTER UPDATE ON floors
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('floors', 'UPDATE', NEW.id,
            json_object('hospital_id', NEW.hospital_id,
                        'floor_number', NEW.floor_number,
                        'description', NEW.description));
END;

CREATE TRIGGER trg_floors_ad AFTER DELETE ON floors
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('floors', 'DELETE', OLD.id);
END;

-- ----- Physicians
CREATE TRIGGER trg_physicians_ai AFTER INSERT ON physicians
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('physicians', 'INSERT', NEW.id,
            json_object('name', NEW.name, 'specialty', NEW.specialty));
END;

CREATE TRIGGER trg_physicians_au AFTER UPDATE ON physicians
BEGIN
