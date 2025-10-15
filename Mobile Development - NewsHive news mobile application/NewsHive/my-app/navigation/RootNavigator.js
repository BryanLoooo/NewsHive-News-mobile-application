// navigation/RootNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeCtx } from '../components/ThemeContext'; // ← ensure this path matches your project

// Tabs
import HomeScreen from '../screens/HomeScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
// If your file is StatsScreen.js, import from '../screens/StatsScreen'
import StatsScreen from '../screens/StatisticsScreen';

// Account stack screens
import AccountScreen from '../screens/AccountScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import FAQScreen from '../screens/FAQScreen';
import UpdateAccountScreen from '../screens/UpdateAccountScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

// Auth
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { watchAuth } from '../services/auth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AccountStackNav = createNativeStackNavigator();

// ---------- Account stack (for Account tab)
function AccountStack() {
  return (
    <AccountStackNav.Navigator>
      <AccountStackNav.Screen
        name="AccountHome"
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
      <AccountStackNav.Screen name="Settings" component={SettingsScreen} />
      <AccountStackNav.Screen name="Feedback" component={FeedbackScreen} />
      <AccountStackNav.Screen name="FAQ" component={FAQScreen} />
      <AccountStackNav.Screen name="UpdateAccount" component={UpdateAccountScreen} options={{ title: 'Update Account' }} />
      <AccountStackNav.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
    </AccountStackNav.Navigator>
  );
}

// ---------- Tabs (shown when logged in)
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'newspaper-outline',
            Favourites: 'bookmark-outline',
            Stats: 'stats-chart-outline',
            Account: 'person-circle-outline',
          };
          return <Ionicons name={map[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
        // Let NavigationContainer theme control colors (defaults handle dark/light nicely)
        tabBarActiveTintColor: undefined,
        tabBarInactiveTintColor: undefined,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Account" component={AccountStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// ---------- Auth stack (login/register)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ---------- Root (switch on auth)
export default function RootNavigator() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const { theme } = useThemeCtx();
  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    const unsub = watchAuth(setUser);
    return unsub;
  }, []);

  return (
    <NavigationContainer theme={navTheme}>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
