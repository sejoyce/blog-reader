// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ArticleListScreen from './screens/ArticleListScreen';
import WebViewScreen from './screens/WebViewScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // 👈 hides "Home" and removes top spacing
        />
        <Stack.Screen name="Articles" component={ArticleListScreen} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}