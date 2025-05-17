import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HospitalListScreen from './screens/HospitalListScreen';
import AddHospitalScreen from './screens/AddHospitalScreen';
import PatientListScreen from './screens/PatientListScreen';
import AddPatientScreen from './screens/AddPatientScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Hospitals" component={HospitalListScreen} />
        <Stack.Screen name="AddHospital" component={AddHospitalScreen} options={{ title: 'Add Hospital' }} />
        <Stack.Screen name="Patients" component={PatientListScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ title: 'Add Patient' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
