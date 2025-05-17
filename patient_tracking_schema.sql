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

