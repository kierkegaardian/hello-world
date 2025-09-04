import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import db, { resetDatabase } from '../db';

export default function HospitalListScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState('');
  const [showRetired, setShowRetired] = useState(false);

  useEffect(() => {
    loadHospitals();
  }, [filter, showRetired]);

  useFocusEffect(
    useCallback(() => {
      loadHospitals();
    }, [loadHospitals])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Overview" onPress={() => navigation.navigate('PatientsOverview')} />
          <Button
            title="Reset"
            onPress={() => {
              Alert.alert('Reset Data', 'This will clear and reseed local data.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: async () => {
                    await resetDatabase();
                    loadHospitals();
                  },
                },
              ]);
            }}
          />
        </View>
      ),
    });
  }, [navigation, loadHospitals]);

  const loadHospitals = useCallback(() => {
    db.transaction(tx => {
      // Ensure table exists to avoid first-run race with initialization
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS hospitals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT, retired INTEGER DEFAULT 0);'
      );
      const base =
        'SELECT h.id, h.name, h.location, h.retired, ' +
        '(SELECT COUNT(*) FROM patients p WHERE p.hospital_id = h.id) AS patientCount ' +
        'FROM hospitals h ';
      const where = [];
      const params = [];
      if (!showRetired) {
        where.push('h.retired = 0');
      }
      if (filter) {
        const q = `%${filter.trim().toLowerCase()}%`;
        where.push('(LOWER(h.name) LIKE ? OR LOWER(h.location) LIKE ?)');
        params.push(q, q);
      }
      const sql =
        base + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '') +
        'ORDER BY h.name ASC;';
      tx.executeSql(
        sql,
        params,
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setHospitals(data);
        },
        (_, err) => {
          console.error('Hospital query failed', err);
          return false;
        }
      );
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
