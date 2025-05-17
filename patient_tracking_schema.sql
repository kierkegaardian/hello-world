-- Sample SQL schema for patient tracking application

-- Table: hospitals
CREATE TABLE hospitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT
);

-- Table: floors
CREATE TABLE floors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    floor_number INTEGER NOT NULL,
    description TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Table: physicians
CREATE TABLE physicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT
);

-- Table: patients
CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birthdate DATE,
    medical_issue TEXT,
    hospital_id INTEGER,
    floor_id INTEGER,
    attending_physician_id INTEGER,
    notes TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (floor_id) REFERENCES floors(id),
    FOREIGN KEY (attending_physician_id) REFERENCES physicians(id)
);

-- Table: attachments
CREATE TABLE attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    description TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Sample indices for performance
CREATE INDEX idx_patients_hospital ON patients(hospital_id);
CREATE INDEX idx_patients_floor ON patients(floor_id);
CREATE INDEX idx_patients_physician ON patients(attending_physician_id);


-- Table: audit_log
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    row_id INTEGER,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Triggers for hospitals
CREATE TRIGGER hospitals_audit_insert AFTER INSERT ON hospitals
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('hospitals', 'INSERT', NEW.id);
END;
CREATE TRIGGER hospitals_audit_update AFTER UPDATE ON hospitals
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('hospitals', 'UPDATE', NEW.id);
END;
CREATE TRIGGER hospitals_audit_delete AFTER DELETE ON hospitals
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('hospitals', 'DELETE', OLD.id);
END;

-- Triggers for floors
CREATE TRIGGER floors_audit_insert AFTER INSERT ON floors
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('floors', 'INSERT', NEW.id);
END;
CREATE TRIGGER floors_audit_update AFTER UPDATE ON floors
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('floors', 'UPDATE', NEW.id);
END;
CREATE TRIGGER floors_audit_delete AFTER DELETE ON floors
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('floors', 'DELETE', OLD.id);
END;

-- Triggers for physicians
CREATE TRIGGER physicians_audit_insert AFTER INSERT ON physicians
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('physicians', 'INSERT', NEW.id);
END;
CREATE TRIGGER physicians_audit_update AFTER UPDATE ON physicians
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('physicians', 'UPDATE', NEW.id);
END;
CREATE TRIGGER physicians_audit_delete AFTER DELETE ON physicians
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('physicians', 'DELETE', OLD.id);
END;

-- Triggers for patients
CREATE TRIGGER patients_audit_insert AFTER INSERT ON patients
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('patients', 'INSERT', NEW.id);
END;
CREATE TRIGGER patients_audit_update AFTER UPDATE ON patients
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('patients', 'UPDATE', NEW.id);
END;
CREATE TRIGGER patients_audit_delete AFTER DELETE ON patients
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('patients', 'DELETE', OLD.id);
END;

-- Triggers for attachments
CREATE TRIGGER attachments_audit_insert AFTER INSERT ON attachments
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('attachments', 'INSERT', NEW.id);
END;
CREATE TRIGGER attachments_audit_update AFTER UPDATE ON attachments
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('attachments', 'UPDATE', NEW.id);
END;
CREATE TRIGGER attachments_audit_delete AFTER DELETE ON attachments
BEGIN
    INSERT INTO audit_log(table_name, operation, row_id)
    VALUES ('attachments', 'DELETE', OLD.id);
END;

