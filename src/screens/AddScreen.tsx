import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../theme';

export default function AddScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}
      edges={['top', 'right', 'left', 'bottom']}
    >
      <Text style={{ color: theme.colors.text }}>Add Screen</Text>
    </SafeAreaView>
  );
}
