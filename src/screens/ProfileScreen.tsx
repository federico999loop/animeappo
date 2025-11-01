import React from 'react';
import { View, Text } from 'react-native';
import theme from '../theme';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Profile Screen</Text>
    </View>
  );
}
