import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patient.db', location: 'default' });

export default function HospitalListScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS hospitals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, notes TEXT);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS floors (id INTEGER PRIMARY KEY AUTOINCREMENT, hospital_id INTEGER, floor_number INTEGER, notes TEXT);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, medical_issue TEXT, hospital_id INTEGER, floor_id INTEGER, checked_in INTEGER DEFAULT 1);'
      );
    });
    loadHospitals();
  }, []);

  const loadHospitals = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT hospitals.id, hospitals.name, hospitals.address, hospitals.notes, COUNT(patients.id) as patientCount FROM hospitals LEFT JOIN patients ON hospitals.id = patients.hospital_id GROUP BY hospitals.id, hospitals.name, hospitals.address, hospitals.notes HAVING hospitals.name LIKE ?;',
        [`%${filter}%`],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          setHospitals(data);
        }
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Filter hospitals" value={filter} onChangeText={text => setFilter(text)} onSubmitEditing={loadHospitals} />
      <Button title="Add Hospital" onPress={() => navigation.navigate('AddHospital', { reload: loadHospitals })} />
      <FlatList
        data={hospitals}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Patients', { hospital: item })}>
            <Text style={{ fontSize: 18 }}>{item.name} ({item.patientCount})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
