import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HospitalListScreen from './screens/HospitalListScreen';
import AddHospitalScreen from './screens/AddHospitalScreen';
import PatientListScreen from './screens/PatientListScreen';
import AddPatientScreen from './screens/AddPatientScreen';
import PatientsOverviewScreen from './screens/PatientsOverviewScreen';
import { initializeDatabase, seedSampleData } from './db';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initializeDatabase();
    // Seed a few records on first run for faster testing
    seedSampleData();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Hospitals" component={HospitalListScreen} />
        <Stack.Screen name="PatientsOverview" component={PatientsOverviewScreen} options={{ title: 'Patients Overview' }} />
        <Stack.Screen name="AddHospital" component={AddHospitalScreen} options={{ title: 'Add Hospital' }} />
        <Stack.Screen name="Patients" component={PatientListScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ title: 'Add Patient' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
