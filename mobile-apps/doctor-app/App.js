import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import PatientsScreen from './src/screens/PatientsScreen';
import PrescriptionsScreen from './src/screens/PrescriptionsScreen';
import TelemedicineScreen from './src/screens/TelemedicineScreen';
import CDSScreen from './src/screens/ClinicalDecisionSupport';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#00796B',
          tabBarInactiveTintColor: '#8E8E93',
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Patients" component={PatientsScreen} />
        <Tab.Screen name="Prescriptions" component={PrescriptionsScreen} />
        <Tab.Screen name="Telemedicine" component={TelemedicineScreen} />
        <Tab.Screen name="CDS" component={CDSScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
