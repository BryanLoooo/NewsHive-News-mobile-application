// screens/AccountScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logout } from '../services/auth';
import { useThemeCtx, palettes } from '../components/ThemeContext';

function ThemedButton({ title, onPress, colors, variant = 'accent' }) {
  const bg =
    variant === 'danger' ? '#f87171'
    : variant === 'secondary' ? colors.card
    : colors.accent; // default accent

  const textColor = variant === 'secondary' ? colors.text : colors.buttonText;

  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function AccountScreen({ navigation }) {
  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const themed = createStyles(colors);

  const onLogout = async () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            navigation.replace('Login');
          } catch (e) {
            Alert.alert('Error', e?.message || 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <View style={themed.container}>
      <ThemedButton title="Settings" onPress={() => navigation.navigate('Settings')} colors={colors} />
      <ThemedButton title="Feedback" onPress={() => navigation.navigate('Feedback')} colors={colors} />
      <ThemedButton title="FAQ" onPress={() => navigation.navigate('FAQ')} colors={colors} />
      <ThemedButton title="Logout" onPress={onLogout} colors={colors} variant="danger" />
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.bg,
    },
  });
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
