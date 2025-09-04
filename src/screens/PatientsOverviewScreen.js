import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../db';

export default function PatientsOverviewScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [floors, setFloors] = useState([]);
  const [hospitalId, setHospitalId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [filter, setFilter] = useState('');
  const [showRetired, setShowRetired] = useState(false);
  const [patients, setPatients] = useState([]);

  const loadHospitals = useCallback(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS hospitals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT, retired INTEGER DEFAULT 0);'
      );
      tx.executeSql(
        'SELECT id, name FROM hospitals ORDER BY name ASC;',
        [],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setHospitals(data);
        }
      );
    });
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  useEffect(() => {
    if (!hospitalId) {
      setFloors([]);
      setFloorId(null);
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS floors (id INTEGER PRIMARY KEY AUTOINCREMENT, hospital_id INTEGER NOT NULL, floor_number INTEGER NOT NULL, description TEXT);'
      );
      tx.executeSql(
        'SELECT id, floor_number FROM floors WHERE hospital_id = ? ORDER BY floor_number ASC;',
        [hospitalId],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setFloors(data);
        }
      );
    });
  }, [hospitalId]);

  const loadPatients = useCallback(() => {
    db.transaction(tx => {
      const where = [];
      const params = [];
      if (!showRetired) where.push('p.retired = 0');
      if (hospitalId) {
        where.push('p.hospital_id = ?');
        params.push(hospitalId);
      }
      if (floorId) {
        where.push('p.floor_id = ?');
        params.push(floorId);
      }
      if (filter) {
        where.push('LOWER(p.name) LIKE ?');
        params.push(`%${filter.trim().toLowerCase()}%`);
      }
      const sql =
        'SELECT p.id, p.name, p.retired, p.medical_issue, p.hospital_id, h.name AS hospital_name, f.floor_number ' +
        'FROM patients p ' +
        'LEFT JOIN hospitals h ON h.id = p.hospital_id ' +
        'LEFT JOIN floors f ON f.id = p.floor_id ' +
        (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '') +
        'ORDER BY h.name ASC, p.name ASC;';
      tx.executeSql(
        sql,
        params,
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setPatients(data);
        },
        (_, err) => {
          console.error('Overview query failed', err);
          return false;
        }
      );
    });
  }, [hospitalId, floorId, filter, showRetired]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Add"
          onPress={() =>
            navigation.navigate('AddPatient', {
              hospital: hospitalId ? { id: hospitalId, name: hospitals.find(h => h.id === hospitalId)?.name || '' } : null,
              reload: loadPatients,
            })
          }
        />
      ),
    });
  }, [navigation, hospitalId, hospitals, loadPatients]);

  const toggleRetired = (patient) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE patients SET retired = ? WHERE id = ?;',
        [patient.retired ? 0 : 1, patient.id],
        loadPatients
      );
    });
  };

  const renderItem = ({ item }) => (
    <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate('AddPatient', {
            patientId: item.id,
            hospital: item.hospital_id ? { id: item.hospital_id, name: item.hospital_name } : null,
            reload: loadPatients,
          })
        }
      >
        <Text style={{ fontWeight: '600', color: item.retired ? 'gray' : 'black' }}>{item.name}</Text>
        <Text style={{ color: '#555' }}>{item.hospital_name || '—'}{item.floor_number ? ` • Floor ${item.floor_number}` : ''}</Text>
        {item.medical_issue ? <Text style={{ color: '#777' }}>{item.medical_issue}</Text> : null}
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title={item.retired ? 'Unretire' : 'Retire'} onPress={() => toggleRetired(item)} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 8 }}>
        <Text>Hospital</Text>
        <Picker selectedValue={hospitalId} onValueChange={v => setHospitalId(v)}>
          <Picker.Item label="All" value={null} />
          {hospitals.map(h => (
            <Picker.Item key={h.id} label={h.name} value={h.id} />
          ))}
        </Picker>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text>Floor</Text>
        <Picker selectedValue={floorId} onValueChange={v => setFloorId(v)} enabled={!!hospitalId}>
          <Picker.Item label={hospitalId ? 'All Floors' : 'Choose a hospital'} value={null} />
          {floors.map(f => (
            <Picker.Item key={f.id} label={`Floor ${f.floor_number}`} value={f.id} />
          ))}
        </Picker>
      </View>

      <TextInput placeholder="Search patients" value={filter} onChangeText={setFilter} />
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <Button title={showRetired ? 'Hide Retired' : 'View Retired'} onPress={() => setShowRetired(r => !r)} />
      </View>

      <FlatList
        data={patients}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
