import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AddHospitalScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [floors, setFloors] = useState('');
  const [notes, setNotes] = useState('');

  const onSave = () => {
    // Placeholder for save logic
    console.log('Save hospital', { name, address, floors, notes });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hospital Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      <Text style={styles.label}>Number of Floors</Text>
      <TextInput style={styles.input} value={floors} onChangeText={setFloors} keyboardType="numeric" />
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
  addButton: { marginTop: 20, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  addButtonText: { color: 'white', textAlign: 'center' }
});
