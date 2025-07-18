import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFeed } from '../services/feedService';

export default function Articles({ route, navigation }) {
  const { feedKey } = route.params;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      console.log('Fetching feed for:', feedKey);
      try {
        const data = await getFeed(feedKey);
        console.log('Articles received:', data.length);
        setArticles(data);
      } catch (error) {
        console.error('Error loading feed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [feedKey]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.link}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
          <TouchableOpacity onPress={() => navigation.navigate('WebView', { url: item.link })}>
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}