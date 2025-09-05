import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'patienttracker.db', location: 'default' });
export default db;

