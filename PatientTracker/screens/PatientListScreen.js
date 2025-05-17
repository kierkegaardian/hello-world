import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patienttracker.db' });

export default function PatientList({ route, navigation }) {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('');
  const hospitalId = route.params?.hospitalId;

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, medical_issue TEXT, hospital_id INTEGER, floor_id INTEGER, checked_in INTEGER DEFAULT 1);'
      );
      const params = hospitalId ? [hospitalId] : [];
      const query = hospitalId ? 'SELECT * FROM patients WHERE hospital_id = ?' : 'SELECT * FROM patients';
      tx.executeSql(query, params, (_, { rows }) => {
        setPatients(rows.raw());
      });
    });
  }, [hospitalId]);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Search patients" value={filter} onChangeText={setFilter} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('AddPatient', { patientId: item.id })}>
            <Text style={{ fontSize: 18, color: item.checked_in ? 'black' : 'gray' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate('AddPatient')} style={{ marginTop: 12 }}>
        <Text style={{ color: 'blue' }}>Add Patient</Text>
      </TouchableOpacity>
    </View>
  );
}
