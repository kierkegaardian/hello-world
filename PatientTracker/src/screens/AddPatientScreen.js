import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Picker } from "@react-native-picker/picker";

const db = openDatabase({ name: 'patient.db', location: 'default' });

export default function AddPatientScreen({ navigation, route }) {
  const { hospital } = route.params;
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [medicalIssue, setMedicalIssue] = useState('');
  const [floorId, setFloorId] = useState(null);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id, floor_number FROM floors WHERE hospital_id = ?;',
        [hospital.id],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setFloors(data);
        }
      );
    });
  }, []);

  const addPatient = () => {
    if (!name) return Alert.alert('Name required');
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO patients (name, birthdate, medical_issue, hospital_id, floor_id) VALUES (?, ?, ?, ?, ?);',
        [name, birthdate, medicalIssue, hospital.id, floorId],
        () => {
          route.params?.reload && route.params.reload();
          navigation.goBack();
        }
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Hospital: {hospital.name}</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Birthdate" value={birthdate} onChangeText={setBirthdate} />
      <TextInput placeholder="Medical Issue" value={medicalIssue} onChangeText={setMedicalIssue} />
      <Picker selectedValue={floorId} onValueChange={(value) => setFloorId(value)}>
        <Picker.Item label="Select Floor" value={null} />
        {floors.map(f => (
          <Picker.Item key={f.id} label={`Floor ${f.floor_number}`} value={f.id} />
        ))}
      </Picker>
      <Button title="Save" onPress={addPatient} />
    </View>
  );
}
