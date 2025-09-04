import { openDatabase } from 'react-native-sqlite-storage';

// Single unified database for the app
const db = openDatabase({ name: 'patienttracker.db', location: 'default' });

export const initializeDatabase = () => {
  db.transaction(tx => {
    // Ensure foreign keys are enforced
    tx.executeSql('PRAGMA foreign_keys = ON;');
    // Core tables
    tx.executeSql(`CREATE TABLE IF NOT EXISTS hospitals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT, retired INTEGER DEFAULT 0);`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS floors (id INTEGER PRIMARY KEY AUTOINCREMENT, hospital_id INTEGER NOT NULL, floor_number INTEGER NOT NULL, description TEXT, FOREIGN KEY (hospital_id) REFERENCES hospitals(id));`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS physicians (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, specialty TEXT);`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, birthdate TEXT, medical_issue TEXT, hospital_id INTEGER, floor_id INTEGER, attending_physician_id INTEGER, notes TEXT, retired INTEGER DEFAULT 0, FOREIGN KEY (hospital_id) REFERENCES hospitals(id), FOREIGN KEY (floor_id) REFERENCES floors(id), FOREIGN KEY (attending_physician_id) REFERENCES physicians(id));`);
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

  // Backfill: add retired column to existing tables if missing
  db.transaction(tx => {
    tx.executeSql(
      "ALTER TABLE hospitals ADD COLUMN retired INTEGER DEFAULT 0;",
      [],
      undefined,
      // Ignore error if column already exists
      () => {}
    );
    tx.executeSql(
      "ALTER TABLE patients ADD COLUMN retired INTEGER DEFAULT 0;",
      [],
      undefined,
      () => {}
    );
  });
};

export const seedSampleData = () => {
  // Insert sample data only if there are no hospitals yet
  db.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) as cnt FROM hospitals;',
      [],
      (_, rs) => {
        const cnt = rs.rows.item(0).cnt;
        if (cnt > 0) return; // already seeded/has data

        // Seed two hospitals
        tx.executeSql(
          'INSERT INTO hospitals (name, location) VALUES (?, ?);',
          ['General Hospital', 'Downtown'],
          (_, res1) => {
            const h1 = res1.insertId;
            // Floors for hospital 1
            tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h1, 1, 'ER / Admissions']);
            tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h1, 2, 'Surgery']);
            tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h1, 3, 'Recovery']);

            // Example patients for hospital 1
            tx.executeSql(
              'INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id, notes) VALUES (?, ?, ?, ?, ?, ?);',
              ['Alice Carter', '1988-05-12', 'Appendicitis', h1, null, 'NPO after midnight']
            );
            tx.executeSql(
              'INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id, notes, retired) VALUES (?, ?, ?, ?, ?, ?, ?);',
              ['Bob Nguyen', '1975-11-03', 'Knee Surgery', h1, null, 'PT scheduled', 1]
            );
          }
        );

        tx.executeSql(
          'INSERT INTO hospitals (name, location) VALUES (?, ?);',
          ['City Clinic', 'Uptown'],
          (_, res2) => {
            const h2 = res2.insertId;
            // Floors for hospital 2
            tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h2, 1, 'Check-in / Radiology']);
            tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h2, 2, 'Outpatient']);

            // Example patient for hospital 2
            tx.executeSql(
              'INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id, notes) VALUES (?, ?, ?, ?, ?, ?);',
              ['Chloe Patel', '1992-09-21', 'Pneumonia', h2, null, 'Antibiotics day 2']
            );
          }
        );
      }
    );
  });
};

export const resetDatabase = () => {
  return new Promise(resolve => {
    db.transaction(
      tx => {
        tx.executeSql('DROP TABLE IF EXISTS attachments;');
        tx.executeSql('DROP TABLE IF EXISTS patients;');
        tx.executeSql('DROP TABLE IF EXISTS floors;');
        tx.executeSql('DROP TABLE IF EXISTS physicians;');
        tx.executeSql('DROP TABLE IF EXISTS audit_log;');
        tx.executeSql('DROP TABLE IF EXISTS hospitals;');
      },
      () => {
        // On error dropping tables, still try to re-init
        initializeDatabase();
        seedSampleData();
        resolve();
      },
      () => {
        initializeDatabase();
        seedSampleData();
        resolve();
      }
    );
  });
};

export default db;
