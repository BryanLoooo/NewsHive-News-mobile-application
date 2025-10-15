// screens/FeedbackScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { addFeedback } from '../services/feedback';
import { useThemeCtx, palettes } from '../components/ThemeContext';

const MAX_LEN = 500;

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

export default function FeedbackScreen() {
  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const themed = createStyles(colors);

  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const charsLeft = Math.max(0, MAX_LEN - msg.length);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await addFeedback({ subject, message: msg });
      Alert.alert('Thanks!', 'Your feedback was sent.');
      setSubject('');
      setMsg('');
    } catch (e) {
      const friendly =
        e?.code === 'auth/not-signed-in'
          ? 'Please log in to send feedback.'
          : e?.code === 'validation/empty-message'
          ? 'Please enter your feedback message.'
          : e?.message || 'Failed to send feedback.';
      Alert.alert('Oops', friendly);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={themed.container}
    >
      <Text style={themed.title}>Send Feedback</Text>

      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="Subject (optional)"
        style={themed.input}
        placeholderTextColor={colors.text + '99'}
      />

      <TextInput
        multiline
        value={msg}
        onChangeText={(t) => setMsg(t.slice(0, MAX_LEN))}
        placeholder="Tell us what’s wrong or what you need help with…"
        style={[themed.input, themed.textarea]}
        placeholderTextColor={colors.text + '99'}
      />

      <View style={themed.row}>
        <Text style={themed.hint}>{charsLeft} characters left</Text>
        {submitting ? <ActivityIndicator color={colors.accent} /> : null}
      </View>

      <ThemedButton
        title={submitting ? 'Submitting…' : 'Submit'}
        onPress={onSubmit}
        colors={colors}
        disabled={submitting || msg.trim().length === 0}
      />
    </KeyboardAvoidingView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 12, textAlign: 'center' },
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
    textarea: { minHeight: 120, textAlignVertical: 'top' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    hint: { color: colors.text, opacity: 0.7 },
  });
}

const styles = StyleSheet.create({
  btn: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: 'bold' },
});
