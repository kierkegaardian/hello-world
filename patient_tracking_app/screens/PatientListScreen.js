import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const SAMPLE_PATIENTS = [
  { id: 'p1', name: 'Alice', hospital: 'General Hospital', checkedIn: true },
  { id: 'p2', name: 'Bob', hospital: 'General Hospital', checkedIn: false },
  { id: 'p3', name: 'Charlie', hospital: 'City Hospital', checkedIn: true }
];

export default function PatientListScreen({ navigation }) {
  const [filter, setFilter] = useState('');

  const filtered = SAMPLE_PATIENTS.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  const renderPatient = ({ item }) => (
    <View style={[styles.patientItem, !item.checkedIn && styles.patientInactive]}>
      <Text style={styles.patientName}>{item.name} - {item.hospital}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search patients"
        value={filter}
        onChangeText={setFilter}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderPatient}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPatient')}>
        <Text style={styles.addButtonText}>Add Patient</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10 },
  patientItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  patientInactive: { backgroundColor: '#ddd' },
  patientName: { fontSize: 16 },
  addButton: { marginTop: 10, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  addButtonText: { color: 'white', textAlign: 'center' }
});
