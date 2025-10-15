// screens/UpdateAccountScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { getOwnerProfile, saveOwnerProfile } from '../services/profile';
import { useThemeCtx, palettes } from '../components/ThemeContext';

// --- helpers (match auth.js logic) ---
const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

// Accepts +6591234567 OR 91234567 -> normalizes to +65########
function normalizePhone(input) {
  if (!input) return '';
  const digits = input.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (/^\d{8}$/.test(digits)) return `+65${digits}`;
  return digits;
}

// Expect "YYYY-MM-DD"
function parseDOBToDate(dobStr) {
  if (!dobStr) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) return null;
  const d = new Date(`${dobStr}T00:00:00Z`);
  return isNaN(d.getTime()) ? null : d;
}

function formatDateYYYYMMDD(date) {
  if (!date) return '';
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
// -------------------------------------

function ThemedButton({ title, onPress, colors, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: colors.accent }, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.btnText, { color: colors.buttonText }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function UpdateAccountScreen() {
  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const themed = createStyles(colors);

  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // "YYYY-MM-DD"
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await getOwnerProfile(); // returns camelCase fields
        if (p) {
          setFirst(p.firstName || '');
          setLast(p.lastName || '');
          setPhoneNumber(p.phoneNumber || '');
          const dobStr = p.dateOfBirth
            ? formatDateYYYYMMDD(p.dateOfBirth.toDate ? p.dateOfBirth.toDate() : new Date(p.dateOfBirth))
            : '';
          setDateOfBirth(dobStr);
          setAddress(p.address || '');
        }
      } catch (e) {
        Alert.alert('Error', e?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async () => {
    try {
      if (!firstName.trim() || !lastName.trim()) {
        return Alert.alert('Missing fields', 'First and last name are required.');
      }

      const normalizedPhone = normalizePhone(phoneNumber.trim());
      const dobDate = parseDOBToDate(dateOfBirth.trim());
      if (dateOfBirth && !dobDate) {
        return Alert.alert('Invalid DOB', 'Use format YYYY-MM-DD.');
      }

      setSaving(true);
      await saveOwnerProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: normalizedPhone || null,
        dateOfBirth: dobDate || null, // service converts to Timestamp
        address: address.trim() || null,
      });
      Alert.alert('Saved', 'Your account details were updated.');
    } catch (e) {
      Alert.alert('Oops', e?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[themed.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} style={themed.container} keyboardShouldPersistTaps="handled">
      <Text style={themed.title}>Update Account</Text>

      <TextInput
        style={themed.input}
        placeholder="First name"
        placeholderTextColor={colors.text + '99'}
        value={firstName}
        onChangeText={setFirst}
      />
      <TextInput
        style={themed.input}
        placeholder="Last name"
        placeholderTextColor={colors.text + '99'}
        value={lastName}
        onChangeText={setLast}
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
        style={[themed.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Address"
        placeholderTextColor={colors.text + '99'}
        multiline
        value={address}
        onChangeText={setAddress}
      />

      <ThemedButton
        title={saving ? 'Saving…' : 'Save'}
        onPress={onSave}
        colors={colors}
        disabled={saving}
      />
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
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
  btn: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
