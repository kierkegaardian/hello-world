import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AddPatientScreen({ navigation }) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [issue, setIssue] = useState('');
  const [hospital, setHospital] = useState('');
  const [notes, setNotes] = useState('');

  const onSave = () => {
    // Placeholder for save logic
    console.log('Save patient', { name, birthdate, issue, hospital, notes });
    navigation.goBack();
  };

  const addHospital = () => {
    navigation.navigate('AddHospital');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Birthdate</Text>
      <TextInput style={styles.input} value={birthdate} onChangeText={setBirthdate} placeholder="YYYY-MM-DD" />
      <Text style={styles.label}>Medical Issue</Text>
      <TextInput style={styles.input} value={issue} onChangeText={setIssue} />
      <Text style={styles.label}>Hospital</Text>
      <TextInput style={styles.input} value={hospital} onChangeText={setHospital} />
      <TouchableOpacity onPress={addHospital}><Text style={styles.link}>Create new hospital</Text></TouchableOpacity>
      <Text style={styles.label}>Notes</Text>
      <TextInput style={[styles.input, styles.multiline]} value={notes} onChangeText={setNotes} multiline />
      <TouchableOpacity style={styles.addButton} onPress={onSave}>
        <Text style={styles.addButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: '600', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
  multiline: { height: 80 },
  link: { color: '#007AFF', marginTop: 5 },
  addButton: { marginTop: 20, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  addButtonText: { color: 'white', textAlign: 'center' }
});
