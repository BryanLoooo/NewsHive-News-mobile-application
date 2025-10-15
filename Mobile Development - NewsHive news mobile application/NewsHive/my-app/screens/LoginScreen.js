// screens/LoginScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { login, watchAuth } from '../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsub = watchAuth(user => { if (user) {/* no-op */} });
    return unsub;
  }, []);

  const onLogin = async () => {
    try {
      await login({ email, password });
      Alert.alert('Success', 'Welcome back!');
    } catch (e) {
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/login-pic.png')} // ✅ use your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 12 }}>
          <Text style={styles.link}>No account? Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    marginLeft: 20
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
    color: '#000',
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  link: { color: 'white', textAlign: 'center', fontWeight: '600' },
  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginVertical: 12,
    resizeMode: 'contain',
  },
});
