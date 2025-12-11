import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SplashScreen from '../screens/SplashScreen';
import UserSelectionScreen from '../screens/UserSelectionScreen';
import HomeScreen from '../screens/HomeScreen';
import AddMeasurementScreen from '../screens/AddMeasurementScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const MainTabs = ({route}: any) => {
  const {userId} = route.params;

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#3498db',
          height: 3,
          top: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarPressColor: '#e8f4fd',
        swipeEnabled: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{userId}}
        options={{
          tabBarLabel: 'Measurements',
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        initialParams={{userId}}
        options={{
          tabBarLabel: 'Statistics',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        initialParams={{userId}}
        options={{
          tabBarLabel: 'History',
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
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
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
