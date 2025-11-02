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
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

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
const TabNavigator: any = Tab.Navigator;
const StackNavigator: any = Stack.Navigator;

function Tabs() {
  return (
    <TabNavigator
      id="TabsRoot"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: theme.spacing.lg,
          right: theme.spacing.lg,
          bottom: theme.spacing.md,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          borderRadius: theme.radii.xl,
          height: 76,
          paddingHorizontal: theme.spacing.lg,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={theme.colors.gradients.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, borderRadius: theme.radii.xl }}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarItemStyle: {
          marginTop: theme.spacing.sm,
        },
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
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              style={{
                top: -28,
                justifyContent: 'center',
                alignItems: 'center',
                width: 74,
                height: 74,
                borderRadius: 37,
              }}
            >
              <LinearGradient
                colors={theme.colors.gradients.accent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 37,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <MaterialCommunityIcons name="plus" color={theme.colors.white} size={30} />
              </LinearGradient>
            </TouchableOpacity>
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
    </TabNavigator>
  );
}

export default function RootNavigator() {
  return (
    <StackNavigator
      id="RootStack"
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
    </StackNavigator>
  );
}
