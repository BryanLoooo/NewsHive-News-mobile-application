// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { register } from '../services/auth';
import { useThemeCtx, palettes } from '../components/ThemeContext';

function ThemedButton({ title, onPress, colors, loading, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: colors.accent }, (disabled || loading) && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.buttonText} />
      ) : (
        <Text style={[styles.btnText, { color: colors.buttonText }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function RegisterScreen({ navigation }) {
  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const themed = createStyles(colors);

  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // YYYY-MM-DD
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !dateOfBirth || !address || !password) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    if (password !== confirm) return Alert.alert('Error', 'Passwords do not match');

    try {
      setLoading(true);
      await register({ firstName, lastName, email, phoneNumber, dateOfBirth, address, password });
      Alert.alert('Success', 'Account created! Please login.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (e) {
      Alert.alert('Registration failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={themed.container}>
      <Text style={themed.title}>Register</Text>

      <TextInput
        style={themed.input}
        placeholder="First name"
        placeholderTextColor={colors.text + '99'}
        autoCapitalize="words"
        value={firstName}
        onChangeText={setFirst}
      />
      <TextInput
        style={themed.input}
        placeholder="Last name"
        placeholderTextColor={colors.text + '99'}
        autoCapitalize="words"
        value={lastName}
        onChangeText={setLast}
      />
      <TextInput
        style={themed.input}
        placeholder="Email"
        placeholderTextColor={colors.text + '99'}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={themed.input}
        placeholder="Phone number (e.g., +6591234567)"
        placeholderTextColor={colors.text + '99'}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={themed.input}
        placeholder="Date of birth (YYYY-MM-DD)"
        placeholderTextColor={colors.text + '99'}
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
      <TextInput
        style={[themed.input, themed.multiline]}
        placeholder="Address"
        placeholderTextColor={colors.text + '99'}
        value={address}
        onChangeText={setAddress}
        multiline
      />
      <TextInput
        style={themed.input}
        placeholder="Password"
        placeholderTextColor={colors.text + '99'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={themed.input}
        placeholder="Confirm password"
        placeholderTextColor={colors.text + '99'}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <ThemedButton
        title="Create account"
        onPress={onRegister}
        colors={colors}
        loading={loading}
        disabled={false}
      />

      <TouchableOpacity onPress={() => navigation.replace('Login')} style={{ marginTop: 12 }}>
        <Text style={themed.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: 20, justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 16 },
    input: {
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 14,
      height: 48,
      marginBottom: 12,
      color: colors.text,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.text + '22',
    },
    multiline: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
    link: { color: colors.text, textAlign: 'center', fontWeight: '600' },
  });
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: 'bold' },
});
