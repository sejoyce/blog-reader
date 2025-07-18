import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFeed } from '../services/feedService';

export default function ArticleListScreen({ route, navigation }) {
  const { feedKey } = route.params;
  const [articles, setArticles] = useState([]);
  const [readStatus, setReadStatus] = useState({});

  useEffect(() => {
    const loadFeed = async () => {
      const data = await getFeed(feedKey);
      setArticles(data);

      const stored = await AsyncStorage.getItem(`readStatus-${feedKey}`);
      if (stored) setReadStatus(JSON.parse(stored));
    };

    loadFeed();
  }, [feedKey]);

  const toggleRead = async (link) => {
    const updated = {
      ...readStatus,
      [link]: !readStatus[link],
    };
    setReadStatus(updated);
    await AsyncStorage.setItem(`readStatus-${feedKey}`, JSON.stringify(updated));
  };

  const renderItem = ({ item }) => {
    const isRead = !!readStatus[item.link];

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => toggleRead(item.link)}>
            <Text style={{ fontSize: 20 }}>
              {isRead ? '✅' : '⬜️'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('WebView', { url: item.link })}
          style={styles.articleTextWrapper}
        >
          <Text style={[styles.articleTitle, isRead && styles.readArticle]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.link}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  articleTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  articleTitle: {
    fontSize: 16,
    color: '#000',
  },
  readArticle: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
});