import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patient_tracking.db', location: 'default' });

export const initializeDatabase = () => {
  db.transaction(tx => {
    // Core tables
    tx.executeSql(`CREATE TABLE IF NOT EXISTS hospitals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT);`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS floors (id INTEGER PRIMARY KEY AUTOINCREMENT, hospital_id INTEGER NOT NULL, floor_number INTEGER NOT NULL, description TEXT, FOREIGN KEY (hospital_id) REFERENCES hospitals(id));`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS physicians (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, specialty TEXT);`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, birthdate TEXT, medical_issue TEXT, hospital_id INTEGER, floor_id INTEGER, attending_physician_id INTEGER, notes TEXT, FOREIGN KEY (hospital_id) REFERENCES hospitals(id), FOREIGN KEY (floor_id) REFERENCES floors(id), FOREIGN KEY (attending_physician_id) REFERENCES physicians(id));`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS attachments (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER NOT NULL, file_path TEXT NOT NULL, description TEXT, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(id));`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, table_name TEXT NOT NULL, operation TEXT NOT NULL, row_id INTEGER, changed_at DATETIME DEFAULT CURRENT_TIMESTAMP, changed_data TEXT);`);

    // Indices
    tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_patients_hospital ON patients(hospital_id);`);
    tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_patients_floor ON patients(floor_id);`);
    tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_patients_physician ON patients(attending_physician_id);`);

    // Triggers for hospitals
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_hospitals_ai AFTER INSERT ON hospitals
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('hospitals','INSERT',NEW.id,json_object('name',NEW.name,'location',NEW.location));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_hospitals_au AFTER UPDATE ON hospitals
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('hospitals','UPDATE',NEW.id,json_object('name',NEW.name,'location',NEW.location));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_hospitals_ad AFTER DELETE ON hospitals
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id)
  VALUES ('hospitals','DELETE',OLD.id);
END;`);

    // Triggers for floors
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_floors_ai AFTER INSERT ON floors
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('floors','INSERT',NEW.id,json_object('hospital_id',NEW.hospital_id,'floor_number',NEW.floor_number,'description',NEW.description));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_floors_au AFTER UPDATE ON floors
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('floors','UPDATE',NEW.id,json_object('hospital_id',NEW.hospital_id,'floor_number',NEW.floor_number,'description',NEW.description));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_floors_ad AFTER DELETE ON floors
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id)
  VALUES ('floors','DELETE',OLD.id);
END;`);

    // Triggers for physicians
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_physicians_ai AFTER INSERT ON physicians
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('physicians','INSERT',NEW.id,json_object('name',NEW.name,'specialty',NEW.specialty));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_physicians_au AFTER UPDATE ON physicians
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('physicians','UPDATE',NEW.id,json_object('name',NEW.name,'specialty',NEW.specialty));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_physicians_ad AFTER DELETE ON physicians
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id)
  VALUES ('physicians','DELETE',OLD.id);
END;`);

    // Triggers for patients
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_patients_ai AFTER INSERT ON patients
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('patients','INSERT',NEW.id,json_object('name',NEW.name,'hospital_id',NEW.hospital_id,'floor_id',NEW.floor_id,'attending_physician_id',NEW.attending_physician_id));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_patients_au AFTER UPDATE ON patients
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('patients','UPDATE',NEW.id,json_object('name',NEW.name,'hospital_id',NEW.hospital_id,'floor_id',NEW.floor_id,'attending_physician_id',NEW.attending_physician_id));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_patients_ad AFTER DELETE ON patients
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id)
  VALUES ('patients','DELETE',OLD.id);
END;`);

    // Triggers for attachments
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_attachments_ai AFTER INSERT ON attachments
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('attachments','INSERT',NEW.id,json_object('patient_id',NEW.patient_id,'file_path',NEW.file_path,'description',NEW.description));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_attachments_au AFTER UPDATE ON attachments
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id, changed_data)
  VALUES ('attachments','UPDATE',NEW.id,json_object('patient_id',NEW.patient_id,'file_path',NEW.file_path,'description',NEW.description));
END;`);
    tx.executeSql(`CREATE TRIGGER IF NOT EXISTS trg_attachments_ad AFTER DELETE ON attachments
BEGIN
  INSERT INTO audit_log(table_name, operation, row_id)
  VALUES ('attachments','DELETE',OLD.id);
END;`);
  });
};

export default db;

