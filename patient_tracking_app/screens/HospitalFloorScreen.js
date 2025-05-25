import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const SAMPLE_DATA = [
  {
    id: '1',
    name: 'General Hospital',
    floors: [
      { id: '1-1', number: 1, notes: 'ICU', patients: ['Alice', 'Bob'] },
      { id: '1-2', number: 2, notes: 'Recovery', patients: ['Charlie'] }
    ]
  },
  {
    id: '2',
    name: 'City Hospital',
    floors: [
      { id: '2-1', number: 1, notes: 'Pediatrics', patients: [] }
    ]
  }
];

export default function HospitalFloorScreen({ navigation }) {
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState({});

  const filtered = SAMPLE_DATA.filter(h => h.name.toLowerCase().includes(filter.toLowerCase()));

  const toggleExpand = (id) => {
    setExpanded({ ...expanded, [id]: !expanded[id] });
  };

  const renderFloor = (floor) => (
    <View key={floor.id} style={styles.floorContainer}>
      <Text style={styles.floorTitle}>Floor {floor.number} - {floor.patients.length} patients</Text>
      {floor.patients.map(p => (
        <Text key={p} style={styles.patientItem}>{p}</Text>
      ))}
    </View>
  );

  const renderHospital = ({ item }) => (
    <View style={styles.hospitalContainer}>
      <TouchableOpacity onPress={() => toggleExpand(item.id)}>
        <Text style={styles.hospitalTitle}>{item.name} - {item.floors.reduce((a, f) => a + f.patients.length, 0)} patients</Text>
      </TouchableOpacity>
      {expanded[item.id] && item.floors.map(renderFloor)}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Filter hospitals"
        value={filter}
        onChangeText={setFilter}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderHospital}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddHospital')}>
        <Text style={styles.addButtonText}>Add Hospital</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10 },
  hospitalContainer: { marginBottom: 10 },
  hospitalTitle: { fontSize: 18, fontWeight: 'bold' },
  floorContainer: { paddingLeft: 20, marginTop: 5 },
  floorTitle: { fontSize: 16, fontWeight: '600' },
  patientItem: { paddingLeft: 20 },
  addButton: { marginTop: 10, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  addButtonText: { color: 'white', textAlign: 'center' }
});
