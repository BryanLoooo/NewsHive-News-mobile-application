// screens/FAQScreen.js
import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeCtx, palettes } from '../components/ThemeContext';

const FAQ_DATA = [
  { id: '1', q: 'How do I add favourites?', a: 'Tap the star icon on any article to add/remove it from favourites.' },
  { id: '2', q: 'Where can I see my favourites?', a: 'Go to the Favourites tab in the bottom navigation.' },
  { id: '3', q: 'How do I search by topic?', a: 'Open the Search screen from Home and enter a keyword (e.g., “technology”).' },
  { id: '4', q: 'Can I read articles in-app?', a: 'Yes. Tap an article to open the in-app reader (WebView).' },
  { id: '5', q: 'How do I enable dark mode?', a: 'Go to Account → Settings and toggle Dark Mode.' },
];

export default function FAQScreen() {
  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const styles = createStyles(colors);

  const [expanded, setExpanded] = useState(new Set());

  const toggle = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderItem = ({ item }) => {
    const isOpen = expanded.has(item.id);
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => toggle(item.id)} activeOpacity={0.7} style={styles.qRow}>
          <Text style={styles.qText}>{item.q}</Text>
          <Text style={styles.chev}>{isOpen ? '−' : '+'}</Text>
        </TouchableOpacity>
        {isOpen && <Text style={styles.aText}>{item.a}</Text>}
      </View>
    );
  };

  const ItemSeparator = useMemo(() => () => <View style={{ height: 10 }} />, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>FAQ</Text>
      <FlatList
        data={FAQ_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.bg },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: colors.text },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    qRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    qText: { flex: 1, fontSize: 16, fontWeight: '600', marginRight: 8, color: colors.text },
    chev: { fontSize: 22, width: 24, textAlign: 'center', color: colors.accent },
    aText: { marginTop: 8, fontSize: 14, color: colors.text, opacity: 0.8, lineHeight: 20 },
  });
}
