import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { LogBox, StatusBar } from 'react-native';
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import customTheme from './src/theme';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...customTheme.colors,
  },
};

LogBox.ignoreLogs(['AsyncStorage has been extracted']);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
