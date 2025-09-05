import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../db';

export default function AddPatientScreen({ navigation, route }) {
  const hospitalParam = route.params?.hospital || null;
  const patientId = route.params?.patientId || null;
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [medicalIssue, setMedicalIssue] = useState('');
  const [notes, setNotes] = useState('');
  const [floorId, setFloorId] = useState(null);
  const [hospitalId, setHospitalId] = useState(hospitalParam?.id || null);
  const [hospitalName, setHospitalName] = useState(hospitalParam?.name || '');
  const [floors, setFloors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    if (hospitalId) {
      db.transaction(tx => {
        tx.executeSql('SELECT id, floor_number FROM floors WHERE hospital_id = ? ORDER BY floor_number ASC;', [hospitalId], (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setFloors(data);
        });
      });
    } else {
      setFloors([]);
    }
  }, [hospitalId]);

  useEffect(() => {
    if (!patientId) return;
    db.transaction(tx => {
      tx.executeSql('SELECT p.*, h.name AS hospital_name FROM patients p LEFT JOIN hospitals h ON h.id = p.hospital_id WHERE p.id = ?;', [patientId], (_, { rows }) => {
        if (rows.length) {
          const r = rows.item(0);
          setName(r.name || '');
          setBirthdate(r.birthdate || '');
          setMedicalIssue(r.medical_issue || '');
          setNotes(r.notes || '');
          setHospitalId(r.hospital_id || null);
          setHospitalName(r.hospital_name || '');
          setFloorId(r.floor_id || null);
        }
      });
    });
  }, [patientId]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT id, name FROM hospitals ORDER BY name ASC;', [], (_, { rows }) => {
        const data = [];
        for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
        setHospitals(data);
        if (hospitalId) {
          const found = data.find(h => h.id === hospitalId);
          if (found) setHospitalName(found.name);
        }
      });
    });
  }, [hospitalId]);

  const savePatient = () => {
    if (!name) return Alert.alert('Name required');
    if (!hospitalId) return Alert.alert('Please select a hospital');
    db.transaction(tx => {
      if (patientId) {
        tx.executeSql('UPDATE patients SET name=?, birthdate=?, medical_issue=?, hospital_id=?, floor_id=?, notes=? WHERE id=?;', [name, birthdate, medicalIssue, hospitalId, floorId, notes, patientId], () => {
          route.params?.reload && route.params.reload();
          navigation.goBack();
        });
      } else {
        tx.executeSql('INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id, attending_physician_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?);', [name, birthdate, medicalIssue, hospitalId, floorId, null, notes], () => {
          route.params?.reload && route.params.reload();
          navigation.goBack();
        });
      }
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Hospital: {hospitalName || '(select below)'}</Text>
      <Picker selectedValue={hospitalId} onValueChange={v => setHospitalId(v)}>
        <Picker.Item label={hospitalName || 'Select Hospital'} value={hospitalId} />
        {hospitals.filter(h => h.id !== hospitalId).map(h => (
          <Picker.Item key={h.id} label={h.name} value={h.id} />
        ))}
      </Picker>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Birthdate" value={birthdate} onChangeText={setBirthdate} />
      <TextInput placeholder="Medical Issue" value={medicalIssue} onChangeText={setMedicalIssue} />
      <TextInput placeholder="Notes" value={notes} onChangeText={setNotes} />
      <Picker selectedValue={floorId} onValueChange={value => setFloorId(value)}>
        <Picker.Item label="Select Floor" value={null} />
        {floors.map(f => (
          <Picker.Item key={f.id} label={`Floor ${f.floor_number}`} value={f.id} />
        ))}
      </Picker>
      <Button title="Save" onPress={savePatient} />
    </View>
  );
}

