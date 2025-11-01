import { View, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PosterCard from '../components/PosterCard';
import { Text, useTheme } from 'react-native-paper';

type RouteParams = {
  title: string;
  data: any[];
};

export default function SectionListScreen() {
  const theme = useTheme();
  const route = useRoute();
  const { title, data } = route.params as RouteParams;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 18 }}>
      <Text variant="headlineMedium" style={{ fontWeight: '800', marginBottom: 12 }}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.mal_id)}
        renderItem={({ item }) => <PosterCard item={item} width={180} onPress={() => {}} />}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
      />
    </View>
  );
}
