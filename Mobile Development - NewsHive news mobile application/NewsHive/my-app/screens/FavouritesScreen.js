// screens/FavouritesScreen.js
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFavourites } from '../components/FavouriteContext';
import Article from '../components/Article';
import { useThemeCtx, palettes } from '../components/ThemeContext';

export default function FavouritesScreen() {
  const { favourites } = useFavourites(); // object map { [url]: article }
  const favouriteArticles = useMemo(() => Object.values(favourites || {}), [favourites]);

  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const styles = createStyles(colors);

  const [openArticle, setOpenArticle] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{ padding: 12, paddingBottom: 24, flexGrow: 1 }}
        data={favouriteArticles}
        keyExtractor={(item, idx) => item?.url || String(idx)}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Article article={item} variant="large" onOpen={setOpenArticle} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image source={require('../assets/favourites.png')} style={styles.logo} />
            <Text style={styles.emptyText}>No favourites yet.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* In-app reader */}
      <Modal
        visible={!!openArticle}
        animationType="slide"
        onRequestClose={() => setOpenArticle(null)}
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text numberOfLines={1} style={[styles.modalTitle, { color: colors.text }]}>
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
    container: { flex: 1, backgroundColor: colors.bg },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 4,
      paddingHorizontal: 12,
      color: colors.text,
    },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 16, color: colors.text, fontWeight: '600' },
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
    logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 12,
    resizeMode: 'contain',
  },
  });
}
