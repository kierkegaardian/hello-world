import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import db from '../db';

export default function HospitalListScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT hospitals.id, hospitals.name, hospitals.location, COUNT(patients.id) as patientCount FROM hospitals LEFT JOIN patients ON hospitals.id = patients.hospital_id GROUP BY hospitals.id, hospitals.name, hospitals.location HAVING hospitals.name LIKE ?;',
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
