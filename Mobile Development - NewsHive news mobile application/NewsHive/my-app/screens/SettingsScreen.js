// screens/SettingsScreen.js
import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useThemeCtx, palettes } from '../components/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { theme, setTheme } = useThemeCtx();
  const isDark = theme === 'dark';
  const colors = palettes[isDark ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={(v) => setTheme(v ? 'dark' : 'light')} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionText, { color: colors.text }]}>Account</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={() => navigation.navigate('UpdateAccount')}>
        <Text style={[styles.buttonText, { color: '#000' }]}>Update Account Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={[styles.buttonText, { color: '#000' }]}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f87171' }]}
        onPress={() => {
          Alert.alert(
            'Delete account',
            'This will permanently delete your account. Continue?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: () => navigation.navigate('ChangePassword', { deleting: true }) },
            ]
          );
        }}
      >
        <Text style={[styles.buttonText, { color: '#000' }]}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16 },
  title:{ fontSize:22, fontWeight:'bold', marginBottom:16, textAlign:'center' },
  row:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:12 },
  label:{ fontSize:16 },
  sectionHeader:{ marginTop:16, marginBottom:8 },
  sectionText:{ fontWeight:'bold', fontSize:18 },
  button:{ paddingVertical:14, borderRadius:8, alignItems:'center', marginBottom:10 },
  buttonText:{ fontSize:16, fontWeight:'bold' },
});
