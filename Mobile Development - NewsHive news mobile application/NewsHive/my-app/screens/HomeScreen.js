// screens/HomeScreen.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Article from '../components/Article';
import { getTopHeadlines, searchNews } from '../services/news';
import { useThemeCtx, palettes } from '../components/ThemeContext'; // ⬅️ make sure this path matches

const GAP = 12;
const SCREEN_W = Dimensions.get('window').width;
const H_PADDING = 12;
const HALF_W = (SCREEN_W - H_PADDING * 2 - GAP) / 2;

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'business', label: 'Business' },
  { key: 'finance', label: 'Finance' },
  { key: 'technology', label: 'Tech' },
  { key: 'sports', label: 'Sports' },
];

// Build rows in the pattern: 1 full, then 2 side-by-side, repeat
function buildRows(items) {
  const rows = [];
  let i = 0;
  while (i < items.length) {
    rows.push({ type: 'full', items: [items[i]] });
    i++;
    if (i >= items.length) break;

    const pair = [items[i]];
    i++;
    if (i < items.length) {
      pair.push(items[i]);
      i++;
    }
    rows.push({ type: 'half', items: pair });
  }
  return rows;
}

export default function HomeScreen() {
  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const styles = createStyles(colors);

  const [articles, setArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [filter, setFilter] = useState('all');

  // Modal WebView state
  const [openArticle, setOpenArticle] = useState(null);

  const fetchNews = useCallback(async (selectedKey) => {
    try {
      setRefreshing(true);
      let items = [];
      if (selectedKey === 'all') {
        items = await getTopHeadlines({ country: 'us' });
      } else if (selectedKey === 'finance') {
        items = await searchNews('finance');
      } else {
        items = await getTopHeadlines({ country: 'us', category: selectedKey });
      }
      setArticles(items);
    } catch (e) {
      console.warn('fetch error:', e?.message);
      setArticles([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchNews('all');
  }, [fetchNews]);

  const rows = useMemo(() => buildRows(articles), [articles]);

  const onSelectFilter = (k) => {
    setFilter(k);
    fetchNews(k);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
        style={{ width: '100%' }}
      >
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => onSelectFilter(f.key)}
              style={[
                styles.chip,
                { backgroundColor: active ? colors.accent : colors.card },
              ]}
            >
              <Text
                style={{
                  color: active ? colors.buttonText : colors.text,
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 1–2–1–2 pattern */}
      <FlatList
        data={rows}
        keyExtractor={(row, idx) => `${row.type}-${idx}-${row.items?.[0]?.url || idx}`}
        contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: 24 }}
        renderItem={({ item: row }) => {
          if (row.type === 'full') {
            const art = row.items[0];
            if (!art) return null;
            return (
              <View style={{ marginBottom: GAP }}>
                <Article
                  article={art}
                  variant="large"
                  onOpen={setOpenArticle}
                />
              </View>
            );
          }
          // half row (two columns)
          return (
            <View style={{ flexDirection: 'row', gap: GAP, marginBottom: GAP }}>
              {row.items.map((art) => (
                <View key={art.url} style={{ width: HALF_W }}>
                  <Article article={art} variant="small" onOpen={setOpenArticle} />
                </View>
              ))}
              {row.items.length === 1 && <View style={{ width: HALF_W }} />}
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNews(filter)}
            tintColor={colors.text}                   // iOS spinner
            colors={[colors.accent]}                  // Android spinner colors
            progressBackgroundColor={colors.card}     // Android spinner bg
          />
        }
        ListEmptyComponent={
          !refreshing ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: colors.text }}>No articles found.</Text>
            </View>
          ) : null
        }
      />

      {/* WebView Modal */}
      <Modal
        visible={!!openArticle}
        animationType="slide"
        onRequestClose={() => setOpenArticle(null)}
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={[styles.modalRoot]}>
          {/* Simple header */}
          <View style={styles.modalHeader}>
            <Text
              numberOfLines={1}
              style={[styles.modalTitle, { color: colors.text }]}
            >
              {openArticle?.title || 'Article'}
            </Text>
            <TouchableOpacity onPress={() => setOpenArticle(null)}>
              <Text style={{ fontWeight: '700', color: colors.accent }}>Close</Text>
            </TouchableOpacity>
          </View>

          {openArticle?.url ? (
            <WebView
              source={{ uri: openArticle.url }}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator style={{ marginTop: 24 }} color={colors.accent} />
              )}
              originWhitelist={['*']}
            />
          ) : (
            <ActivityIndicator style={{ marginTop: 24 }} color={colors.accent} />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, alignItems: 'stretch' },
    filterBar: { paddingHorizontal: H_PADDING, paddingBottom: 8 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      marginRight: 8,
      marginTop: 20,
      marginBottom: 10,
      height: 40,
      justifyContent: 'center',
    },
    modalRoot: { flex: 1, backgroundColor: colors.bg },
    modalHeader: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.card,
    },
    modalTitle: { fontWeight: '600', fontSize: 16, maxWidth: '80%' },
  });
}
