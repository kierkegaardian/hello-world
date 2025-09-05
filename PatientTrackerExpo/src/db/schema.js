import db from './driver.expo';

export const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql('PRAGMA foreign_keys = ON;');
    tx.executeSql(`CREATE TABLE IF NOT EXISTS hospitals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT, retired INTEGER DEFAULT 0);`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS floors (id INTEGER PRIMARY KEY AUTOINCREMENT, hospital_id INTEGER NOT NULL, floor_number INTEGER NOT NULL, description TEXT, FOREIGN KEY (hospital_id) REFERENCES hospitals(id));`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS physicians (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, specialty TEXT);`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, birthdate TEXT, medical_issue TEXT, hospital_id INTEGER, floor_id INTEGER, attending_physician_id INTEGER, notes TEXT, retired INTEGER DEFAULT 0, FOREIGN KEY (hospital_id) REFERENCES hospitals(id), FOREIGN KEY (floor_id) REFERENCES floors(id), FOREIGN KEY (attending_physician_id) REFERENCES physicians(id));`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS attachments (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER NOT NULL, file_path TEXT NOT NULL, description TEXT, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(id));`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, table_name TEXT NOT NULL, operation TEXT NOT NULL, row_id INTEGER, changed_at DATETIME DEFAULT CURRENT_TIMESTAMP, changed_data TEXT);`);
    tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_patients_hospital ON patients(hospital_id);`);
    tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_patients_floor ON patients(floor_id);`);
    tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_patients_physician ON patients(attending_physician_id);`);
  });
  db.transaction(tx => {
    tx.executeSql("ALTER TABLE hospitals ADD COLUMN retired INTEGER DEFAULT 0;", [], () => {}, () => false);
    tx.executeSql("ALTER TABLE patients ADD COLUMN retired INTEGER DEFAULT 0;", [], () => {}, () => false);
  });
};

export const seedSampleData = () => {
  db.transaction(tx => {
    tx.executeSql('SELECT COUNT(*) as cnt FROM hospitals;', [], (_, rs) => {
      const cnt = rs.rows.item(0).cnt;
      if (cnt > 0) return;
      tx.executeSql('INSERT INTO hospitals (name, location) VALUES (?, ?);', ['General Hospital', 'Downtown'], (_, res1) => {
        const h1 = res1.insertId;
        tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h1, 1, 'ER / Admissions']);
        tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h1, 2, 'Surgery']);
        tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h1, 3, 'Recovery']);
        tx.executeSql('INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id, notes) VALUES (?, ?, ?, ?, ?, ?);', ['Alice Carter', '1988-05-12', 'Appendicitis', h1, null, 'NPO after midnight']);
        tx.executeSql('INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id, notes, retired) VALUES (?, ?, ?, ?, ?, ?, ?);', ['Bob Nguyen', '1975-11-03', 'Knee Surgery', h1, null, 'PT scheduled', 1]);
      });
      tx.executeSql('INSERT INTO hospitals (name, location) VALUES (?, ?);', ['City Clinic', 'Uptown'], (_, res2) => {
        const h2 = res2.insertId;
        tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h2, 1, 'Check-in / Radiology']);
        tx.executeSql('INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);', [h2, 2, 'Outpatient']);
        tx.executeSql('INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id, notes) VALUES (?, ?, ?, ?, ?, ?);', ['Chloe Patel', '1992-09-21', 'Pneumonia', h2, null, 'Antibiotics day 2']);
      });
    });
  });
};

export const resetDatabase = () => new Promise(resolve => {
  db.transaction(
    tx => {
      tx.executeSql('DROP TABLE IF EXISTS attachments;');
      tx.executeSql('DROP TABLE IF EXISTS patients;');
      tx.executeSql('DROP TABLE IF EXISTS floors;');
      tx.executeSql('DROP TABLE IF EXISTS physicians;');
      tx.executeSql('DROP TABLE IF EXISTS audit_log;');
      tx.executeSql('DROP TABLE IF EXISTS hospitals;');
    },
    () => { initializeDatabase(); seedSampleData(); resolve(); },
    () => { initializeDatabase(); seedSampleData(); resolve(); }
  );
});

export default db;

