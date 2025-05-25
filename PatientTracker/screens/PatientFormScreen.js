import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patienttracker.db' });

export default function PatientForm({ navigation, route }) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [issue, setIssue] = useState('');
  const [hospitalId, setHospitalId] = useState(null);
  const [floorId, setFloorId] = useState(null);

  const patientId = route.params?.patientId;

  useEffect(() => {
    if (patientId) {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM patients WHERE id = ?', [patientId], (_, { rows }) => {
          const row = rows.item(0);
          setName(row.name);
          setBirthdate(row.birthdate);
          setIssue(row.medical_issue);
          setHospitalId(row.hospital_id);
          setFloorId(row.floor_id);
        });
      });
    }
  }, [patientId]);

  const save = () => {
    if (!name) return;
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, medical_issue TEXT, hospital_id INTEGER, floor_id INTEGER, checked_in INTEGER DEFAULT 1);'
      );
      if (patientId) {
        tx.executeSql(
          'UPDATE patients SET name=?, birthdate=?, medical_issue=?, hospital_id=?, floor_id=? WHERE id=?',
          [name, birthdate, issue, hospitalId, floorId, patientId],
          () => navigation.goBack()
        );
      } else {
        tx.executeSql(
          'INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id) VALUES (?, ?, ?, ?, ?)',
          [name, birthdate, issue, hospitalId, floorId],
          () => navigation.goBack()
        );
      }
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Birthdate</Text>
      <TextInput value={birthdate} onChangeText={setBirthdate} />
      <Text>Medical Issue</Text>
      <TextInput value={issue} onChangeText={setIssue} />
      {/* Hospital and floor pickers would go here */}
      <Button title="Save" onPress={save} />
    </View>
  );
}
