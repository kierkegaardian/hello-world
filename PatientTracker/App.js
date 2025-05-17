import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HospitalList from './screens/HospitalListScreen';
import HospitalForm from './screens/HospitalFormScreen';
import PatientList from './screens/PatientListScreen';
import PatientForm from './screens/PatientFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Hospitals" component={HospitalList} />
        <Stack.Screen name="AddHospital" component={HospitalForm} options={{ title: 'Add Hospital' }} />
        <Stack.Screen name="Patients" component={PatientList} />
        <Stack.Screen name="AddPatient" component={PatientForm} options={{ title: 'Add Patient' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
