-- Sample SQL schema for patient‑tracking application
-----------------------------------------------------

-- ============
-- Core tables
-- ============

CREATE TABLE hospitals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    location    TEXT
);

CREATE TABLE floors (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    floor_number INTEGER NOT NULL,
    description TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE physicians (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    specialty TEXT
);

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

CREATE TABLE attachments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id  INTEGER NOT NULL,
    file_path   TEXT NOT NULL,
    description TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- ============
-- Indices
-- ============

CREATE INDEX idx_patients_hospital  ON patients(hospital_id);
CREATE INDEX idx_patients_floor     ON patients(floor_id);
CREATE INDEX idx_patients_physician ON patients(attending_physician_id);

-- ============
-- Audit log
-- ============

CREATE TABLE audit_log (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name   TEXT NOT NULL,
    operation    TEXT NOT NULL,          -- INSERT / UPDATE / DELETE
    row_id       INTEGER,
    changed_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    changed_data TEXT                    -- JSON snapshot of NEW values
);

-- ============ 
-- Triggers
-- ============

-- ----- hospitals
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

-- ----- floors
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

-- ----- physicians
CREATE TRIGGER trg_physicians_ai AFTER INSERT ON physicians
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('physicians', 'INSERT', NEW.id,
            json_object('name', NEW.name, 'specialty', NEW.specialty));
END;

CREATE TRIGGER trg_physicians_au AFTER UPDATE ON physicians
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('physicians', 'UPDATE', NEW.id,
            json_object('name', NEW.name, 'specialty', NEW.specialty));
END;

CREATE TRIGGER trg_physicians_ad AFTER DELETE ON physicians
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('physicians', 'DELETE', OLD.id);
END;

-- ----- patients
CREATE TRIGGER trg_patients_ai AFTER INSERT ON patients
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('patients', 'INSERT', NEW.id,
            json_object('name', NEW.name,
                        'hospital_id', NEW.hospital_id,
                        'floor_id', NEW.floor_id,
                        'attending_physician_id', NEW.attending_physician_id));
END;

CREATE TRIGGER trg_patients_au AFTER UPDATE ON patients
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('patients', 'UPDATE', NEW.id,
            json_object('name', NEW.name,
                        'hospital_id', NEW.hospital_id,
                        'floor_id', NEW.floor_id,
                        'attending_physician_id', NEW.attending_physician_id));
END;

CREATE TRIGGER trg_patients_ad AFTER DELETE ON patients
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('patients', 'DELETE', OLD.id);
END;

-- ----- attachments
CREATE TRIGGER trg_attachments_ai AFTER INSERT ON attachments
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('attachments', 'INSERT', NEW.id,
            json_object('patient_id', NEW.patient_id,
                        'file_path', NEW.file_path,
                        'description', NEW.description));
END;

CREATE TRIGGER trg_attachments_au AFTER UPDATE ON attachments
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id, changed_data)
    VALUES ('attachments', 'UPDATE', NEW.id,
            json_object('patient_id', NEW.patient_id,
                        'file_path', NEW.file_path,
                        'description', NEW.description));
END;

CREATE TRIGGER trg_attachments_ad AFTER DELETE ON attachments
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('attachments', 'DELETE', OLD.id);
END;
