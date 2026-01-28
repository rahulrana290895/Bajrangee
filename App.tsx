import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, SafeAreaView  } from 'react-native-safe-area-context';

import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import UpcomingScreen from './src/UpcomingScreen';
import WinningScreen from './src/WinningScreen';
import MoreScreen from './src/MoreScreen';
import ProfileScreen from './src/ProfileScreen';
import ChangePasswordScreen from './src/ChangePasswordScreen';
import JoinedContestScreen from './src/JoinedContestScreen';
import JoinedFestivalContestScreen from './src/JoinedFestivalContestScreen';
import JoinDailyContest from './src/JoinDailyContest';
import JoinFestivalContest from './src/JoinFestivalContest';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs: Home, Upcoming, Winning
function HomeTabs() {
  return (
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header inside tabs
        tabBarActiveTintColor: '#ffa41c',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 5 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Upcoming') iconName = 'calendar';
          else if (route.name === 'Winning') iconName = 'trophy';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upcoming" component={UpcomingScreen} />
      <Tab.Screen name="Winning" component={WinningScreen} />
    </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Login Screen */}
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Bottom Tabs */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeTabs} // Wrap tabs here
          options={{ headerShown: false }} // Hide stack header since each tab can have its own header
        />

        {/* Other Stack Screens */}
        <Stack.Screen
          name="MoreScreen"
          component={MoreScreen}
          options={{
            headerTitle: 'More Options',
            headerStyle: { backgroundColor: '#ffa41c' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JoinedContestScreen"
          component={JoinedContestScreen}
          options={{
            headerTitle: 'My Daily Contest',
            headerStyle: { backgroundColor: '#ffa41c' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="JoinedFestivalContestScreen"
          component={JoinedFestivalContestScreen}
          options={{
            headerTitle: 'My Festival Contest',
            headerStyle: { backgroundColor: '#ffa41c' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="JoinDailyContest"
          component={JoinDailyContest}
          options={{
            headerTitle: 'Join Daily Contest',
            headerStyle: { backgroundColor: '#ffa41c' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="JoinFestivalContest"
          component={JoinFestivalContest}
          options={{
            headerTitle: 'Join Festival Contest',
            headerStyle: { backgroundColor: '#ffa41c' },
            headerTintColor: '#fff',
          }}
        />



      </Stack.Navigator>
    </NavigationContainer>
  );
}
