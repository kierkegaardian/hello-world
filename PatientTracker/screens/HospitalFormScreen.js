import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patienttracker.db' });

export default function HospitalForm({ navigation }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const save = () => {
    if (!name) return;
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO hospitals (name, location, notes) VALUES (?, ?, ?)',
        [name, location, notes],
        () => navigation.goBack()
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Location</Text>
      <TextInput value={location} onChangeText={setLocation} />
      <Text>Notes</Text>
      <TextInput value={notes} onChangeText={setNotes} multiline />
      <Button title="Save" onPress={save} />
    </View>
  );
}
