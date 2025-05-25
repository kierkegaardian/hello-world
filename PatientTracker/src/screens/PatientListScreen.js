import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'patient.db', location: 'default' });

export default function PatientListScreen({ navigation, route }) {
  const { hospital } = route.params;
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadPatients();
  }, [filter]);

  const loadPatients = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT p.id, p.name, p.medical_issue, p.checked_in, f.floor_number FROM patients p LEFT JOIN floors f ON p.floor_id = f.id WHERE p.hospital_id = ? AND p.name LIKE ?;',
        [hospital.id, `%${filter}%`],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          setPatients(data);
        }
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>{hospital.name}</Text>
      <TextInput placeholder="Filter patients" value={filter} onChangeText={setFilter} />
      <TouchableOpacity onPress={() => navigation.navigate('AddPatient', { hospital, reload: loadPatients })}>
        <Text style={{ color: 'blue', marginVertical: 8 }}>Add Patient</Text>
      </TouchableOpacity>
      <FlatList
        data={patients}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 4 }}>
            <Text style={{ color: item.checked_in ? 'black' : 'gray' }}>
              {item.name} - Floor {item.floor_number || '-'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
