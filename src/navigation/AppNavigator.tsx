import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UserSelectionScreen from '../screens/UserSelectionScreen';
import HomeScreen from '../screens/HomeScreen';
import AddMeasurementScreen from '../screens/AddMeasurementScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = ({route}: any) => {
  const {userId} = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{userId}}
        options={{
          tabBarLabel: 'Measurements',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        initialParams={{userId}}
        options={{
          tabBarLabel: 'Statistics',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="UserSelection"
          component={UserSelectionScreen}
          options={{
            title: 'Health Pressure',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddMeasurement"
          component={AddMeasurementScreen}
          options={{
            title: 'New Measurement',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
