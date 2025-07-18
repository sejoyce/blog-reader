// services/storageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadReadState(feedKey) {
  const state = await AsyncStorage.getItem(`readState-${feedKey}`);
  return state ? JSON.parse(state) : {};
}

export async function toggleReadState(feedKey, link) {
  const state = await loadReadState(feedKey);
  state[link] = !state[link];
  await AsyncStorage.setItem(`readState-${feedKey}`, JSON.stringify(state));
}