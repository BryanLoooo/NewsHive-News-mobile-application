// screens/ChangePasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { changePasswordWithReauth, deleteMyAccount } from '../services/profile';
import { useThemeCtx, palettes } from '../components/ThemeContext';

function ThemedButton({ title, onPress, colors, disabled, variant = 'accent' }) {
  const bg =
    variant === 'danger' ? '#f87171'
    : variant === 'secondary' ? colors.card
    : colors.accent;

  const textColor = variant === 'secondary' ? colors.text : colors.buttonText;

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg }, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function ChangePasswordScreen({ route, navigation }) {
  const deleting = route?.params?.deleting === true;

  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const themed = createStyles(colors);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [working, setWorking] = useState(false);

  const onChangePassword = async () => {
    if (!current || !next || !confirm) return Alert.alert('Error', 'Please fill in all fields.');
    if (next !== confirm) return Alert.alert('Error', 'New passwords do not match.');
    if (next.length < 6) return Alert.alert('Weak password', 'Use at least 6 characters.');

    try {
      setWorking(true);
      await changePasswordWithReauth({ currentPassword: current, newPassword: next });
      Alert.alert('Success', 'Password updated.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      const msg = e?.code ? e.code.replace('auth/', '').replace(/-/g, ' ') : e?.message || 'Failed';
      Alert.alert('Error', msg);
    } finally {
      setWorking(false);
    }
  };

  const onDeleteAccount = async () => {
    if (!current) return Alert.alert('Error', 'Enter your current password to confirm.');
    Alert.alert('Confirm delete', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setWorking(true);
            await deleteMyAccount({ currentPassword: current });
            // After deletion, auth state changes and RootNavigator will switch to Auth stack
          } catch (e) {
            const msg = e?.code ? e.code.replace('auth/', '').replace(/-/g, ' ') : e?.message || 'Failed';
            Alert.alert('Error', msg);
          } finally {
            setWorking(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={themed.container}>
      <Text style={themed.title}>
        {deleting ? 'Confirm Password to Delete' : 'Change Password'}
      </Text>

      <TextInput
        style={themed.input}
        placeholder="Current password"
        placeholderTextColor={colors.text + '99'}
        secureTextEntry
        value={current}
        onChangeText={setCurrent}
      />

      {!deleting && (
        <>
          <TextInput
            style={themed.input}
            placeholder="New password"
            placeholderTextColor={colors.text + '99'}
            secureTextEntry
            value={next}
            onChangeText={setNext}
          />
          <TextInput
            style={themed.input}
            placeholder="Confirm new password"
            placeholderTextColor={colors.text + '99'}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
        </>
      )}

      {deleting ? (
        <ThemedButton
          title={working ? 'Deleting…' : 'Delete Account'}
          onPress={onDeleteAccount}
          colors={colors}
          disabled={working}
          variant="danger"
        />
      ) : (
        <ThemedButton
          title={working ? 'Updating…' : 'Update Password'}
          onPress={onChangePassword}
          colors={colors}
          disabled={working}
        />
      )}
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
    title: { color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    input: {
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.text,
      marginBottom: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.text + '22',
    },
  });
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { fontSize: 16, fontWeight: 'bold' },
});
