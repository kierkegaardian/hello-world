import React, { useEffect, useState, useCallback } from 'react';
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

  const loadPatients = useCallback(() => {
    db.transaction(tx => {
      const sql =
        'SELECT p.id, p.name, p.retired, p.medical_issue, f.floor_number ' +
        'FROM patients p LEFT JOIN floors f ON p.floor_id = f.id ' +
        'WHERE p.hospital_id = ? ' +
        (showRetired ? '' : 'AND p.retired = 0 ') +
        'AND p.name LIKE ? ' +
        'ORDER BY p.name ASC;';
      tx.executeSql(sql, [hospital.id, `%${filter}%`], (_, { rows }) => {
        const data = [];
        for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
        setPatients(data);
      });
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
