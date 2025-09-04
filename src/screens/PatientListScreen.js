import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, FlatList, TouchableOpacity, Button } from 'react-native';
import db from '../db';

export default function PatientListScreen({ navigation, route }) {
  const { hospital } = route.params;
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('');
  const [showRetired, setShowRetired] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [filter, showRetired]);

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [loadPatients])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Add" onPress={() => navigation.navigate('AddPatient', { hospital, reload: loadPatients })} />
      ),
    });
  }, [navigation, hospital, loadPatients]);

  const loadPatients = useCallback(() => {
    db.transaction(tx => {
      // Ensure tables exist to avoid first-run race with initialization
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, birthdate TEXT, medical_issue TEXT, hospital_id INTEGER, floor_id INTEGER, attending_physician_id INTEGER, notes TEXT, retired INTEGER DEFAULT 0);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS floors (id INTEGER PRIMARY KEY AUTOINCREMENT, hospital_id INTEGER NOT NULL, floor_number INTEGER NOT NULL, description TEXT);'
      );
      const sql =
        'SELECT p.id, p.name, p.retired, p.medical_issue, f.floor_number ' +
        'FROM patients p LEFT JOIN floors f ON p.floor_id = f.id ' +
        'WHERE p.hospital_id = ? ' +
        (showRetired ? '' : 'AND p.retired = 0 ') +
        'AND LOWER(p.name) LIKE ? ' +
        'ORDER BY p.name ASC;';
      tx.executeSql(
        sql,
        [hospital.id, `%${filter.trim().toLowerCase()}%`],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setPatients(data);
        },
        (_, err) => {
          console.error('Patient query failed', err);
          return false;
        }
      );
    });
  }, [filter, showRetired]);

  const toggleRetired = (patient) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE patients SET retired = ? WHERE id = ?;',
        [patient.retired ? 0 : 1, patient.id],
        loadPatients
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>{hospital.name}</Text>
      <TextInput placeholder="Filter patients" value={filter} onChangeText={setFilter} />
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <Button title={showRetired ? 'Hide Retired' : 'View Retired'} onPress={() => setShowRetired(r => !r)} />
        <TouchableOpacity onPress={() => navigation.navigate('AddPatient', { hospital, reload: loadPatients })}>
          <Text style={{ color: 'blue', marginVertical: 8, marginLeft: 12 }}>Add Patient</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={patients}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: item.retired ? 'gray' : 'black' }}>
              {item.name} - Floor {item.floor_number || '-'}
            </Text>
            <Button title={item.retired ? 'Unretire' : 'Retire'} onPress={() => toggleRetired(item)} />
          </View>
        )}
      />
    </View>
  );
}
