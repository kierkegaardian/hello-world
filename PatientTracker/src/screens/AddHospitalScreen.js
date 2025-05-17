import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ScrollView, Text } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patient.db', location: 'default' });

export default function AddHospitalScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [numFloors, setNumFloors] = useState('0');
  const [floorNotes, setFloorNotes] = useState({});

  const addHospital = () => {
    if (!name) return Alert.alert('Hospital name required');
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO hospitals (name, address, notes) VALUES (?, ?, ?);',
        [name, address, notes],
        (_, result) => {
          const hospitalId = result.insertId;
          const floorCount = parseInt(numFloors, 10) || 0;
          for (let i = 1; i <= floorCount; i++) {
            const note = floorNotes[i] || '';
            tx.executeSql(
              'INSERT INTO floors (hospital_id, floor_number, notes) VALUES (?, ?, ?);',
              [hospitalId, i, note]
            );
          }
        }
      );
    }, undefined, () => {
      route.params?.reload && route.params.reload();
      navigation.goBack();
    });
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput placeholder="Notes" value={notes} onChangeText={setNotes} multiline />
      <TextInput
        placeholder="Number of floors"
        value={numFloors}
        onChangeText={setNumFloors}
        keyboardType="numeric"
      />
      {Array.from({ length: parseInt(numFloors, 10) || 0 }).map((_, index) => (
        <TextInput
          key={index}
          placeholder={`Floor ${index + 1} notes`}
          value={floorNotes[index + 1] || ''}
          onChangeText={text => setFloorNotes({ ...floorNotes, [index + 1]: text })}
          multiline
        />
      ))}
      <Button title="Save" onPress={addHospital} />
    </ScrollView>
  );
}
