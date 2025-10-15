// screens/ArticleScreen.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ArticleScreen({ route }) {
  const { article } = route.params || {};
  if (!article?.url) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: article.url }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={{ marginTop: 24 }} />}
        originWhitelist={['*']}
      />
    </View>
  );
}
