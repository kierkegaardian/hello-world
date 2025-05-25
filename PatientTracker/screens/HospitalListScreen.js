import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patienttracker.db' });

export default function HospitalList({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS hospitals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, notes TEXT);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS floors (id INTEGER PRIMARY KEY AUTOINCREMENT, hospital_id INTEGER, floor_number INTEGER, description TEXT);'
      );
      tx.executeSql('SELECT * FROM hospitals', [], (_, { rows }) => {
        setHospitals(rows.raw());
      });
    });
  }, []);

  const filtered = hospitals.filter(h => h.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Filter hospitals" value={filter} onChangeText={setFilter} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Patients', { hospitalId: item.id })}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Hospital" onPress={() => navigation.navigate('AddHospital')} />
    </View>
  );
}
