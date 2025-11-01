import React from 'react';
import { View, Text } from 'react-native';
import theme from '../theme';

export default function AddScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Add Screen</Text>
    </View>
  );
}
