import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SectionListScreen from '../screens/SectionListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddScreen from '../screens/AddScreen';
import EpisodeListScreen from '../screens/EpisodeListScreen';
import { Anime } from '../types';
import { View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../theme';

export type RootStackParamList = {
  Tabs: undefined;
  Details: { anime: Anime; animate?: boolean };
  SectionList: { title: string; data: any[] };
  EpisodeList: { animeId: number };
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Add: undefined;
  Favorites: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={theme.colors.text} size={size} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              style={{
                top: -20,
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.colors.primary,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Dettagli Anime' }}
      />
      <Stack.Screen
        name="SectionList"
        component={SectionListScreen}
        options={({ route }) => ({ title: (route.params as any)?.title ?? 'Lista' })}
      />
      <Stack.Screen
        name="EpisodeList"
        component={EpisodeListScreen}
        options={{ title: 'Episodi' }}
      />
    </Stack.Navigator>
  );
}
