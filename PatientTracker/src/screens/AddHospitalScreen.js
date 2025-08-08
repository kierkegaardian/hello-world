import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ScrollView } from 'react-native';
import db from '../db';

export default function AddHospitalScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [numFloors, setNumFloors] = useState('0');
  const [floorDescriptions, setFloorDescriptions] = useState({});

  const addHospital = () => {
    if (!name) return Alert.alert('Hospital name required');
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO hospitals (name, location) VALUES (?, ?);',
        [name, location],
        (_, result) => {
          const hospitalId = result.insertId;
          const floorCount = parseInt(numFloors, 10) || 0;
          for (let i = 1; i <= floorCount; i++) {
            const desc = floorDescriptions[i] || '';
            tx.executeSql(
              'INSERT INTO floors (hospital_id, floor_number, description) VALUES (?, ?, ?);',
              [hospitalId, i, desc]
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
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput
        placeholder="Number of floors"
        value={numFloors}
        onChangeText={setNumFloors}
        keyboardType="numeric"
      />
      {Array.from({ length: parseInt(numFloors, 10) || 0 }).map((_, index) => (
        <TextInput
          key={index}
          placeholder={`Floor ${index + 1} description`}
          value={floorDescriptions[index + 1] || ''}
          onChangeText={text => setFloorDescriptions({ ...floorDescriptions, [index + 1]: text })}
          multiline
        />
      ))}
      <Button title="Save" onPress={addHospital} />
    </ScrollView>
  );
}
