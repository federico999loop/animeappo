import { useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Text, TextInput, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Anime } from '../types';
import { searchAnime } from '../services/jikan';
import AnimeCard from '../components/AnimeCard';

function useDebouncedCallback<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback((...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const json = await searchAnime(q, 1);
      setResults(json.data as Anime[]);
    } catch (e: any) {
      setError(e?.message ?? 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, []);

  const debounced = useDebouncedCallback(doSearch, 400);

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: theme.colors.background }}>
      <TextInput
        placeholder="Cerca un anime (es. One Piece)…"
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          debounced(t);
        }}
        autoCapitalize="none"
        style={{ marginBottom: 8 }}
      />

      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={{ color: theme.colors.error, marginVertical: 8 }}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.mal_id)}
        renderItem={({ item }) => (
          <AnimeCard
            item={item}
            onPress={() => navigation.navigate('Details', { anime: item })}
          />
        )}
        contentContainerStyle={{ paddingVertical: 6 }}
      />
    </View>
  );
}
