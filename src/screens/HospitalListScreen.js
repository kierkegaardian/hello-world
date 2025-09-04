import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import db from '../db';

export default function HospitalListScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState('');
  const [showRetired, setShowRetired] = useState(false);

  useEffect(() => {
    loadHospitals();
  }, [filter, showRetired]);

  const loadHospitals = useCallback(() => {
    db.transaction(tx => {
      const base =
        'SELECT h.id, h.name, h.location, h.retired, COUNT(p.id) as patientCount '\
        + 'FROM hospitals h LEFT JOIN patients p ON h.id = p.hospital_id ';
      const where = [];
      const params = [];
      if (!showRetired) {
        where.push('h.retired = 0');
      }
      if (filter) {
        where.push('h.name LIKE ?');
        params.push(`%${filter}%`);
      }
      const sql =
        base + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '') +
        'GROUP BY h.id, h.name, h.location, h.retired ' +
        'ORDER BY h.name ASC;';
      tx.executeSql(sql, params, (_, { rows }) => {
        const data = [];
        for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
        setHospitals(data);
      });
    });
  }, [filter, showRetired]);

  const toggleRetired = (hospital) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE hospitals SET retired = ? WHERE id = ?;',
        [hospital.retired ? 0 : 1, hospital.id],
        loadHospitals
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Filter hospitals" value={filter} onChangeText={text => setFilter(text)} />
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <Button title={showRetired ? 'Hide Retired' : 'View Retired'} onPress={() => setShowRetired(r => !r)} />
        <Button title="Add Hospital" onPress={() => navigation.navigate('AddHospital', { reload: loadHospitals })} />
      </View>
      <FlatList
        data={hospitals}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Patients', { hospital: item })} style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, color: item.retired ? 'gray' : 'black' }}>
                {item.name} ({item.patientCount})
              </Text>
            </TouchableOpacity>
            <Button title={item.retired ? 'Unretire' : 'Retire'} onPress={() => toggleRetired(item)} />
          </View>
        )}
      />
    </View>
  );
}
