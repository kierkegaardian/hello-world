import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HospitalFloorScreen from './screens/HospitalFloorScreen';
import AddHospitalScreen from './screens/AddHospitalScreen';
import PatientListScreen from './screens/PatientListScreen';
import AddPatientScreen from './screens/AddPatientScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Hospitals">
        <Stack.Screen name="Hospitals" component={HospitalFloorScreen} />
        <Stack.Screen name="AddHospital" component={AddHospitalScreen} />
        <Stack.Screen name="Patients" component={PatientListScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
