import { View, Image, Text, Pressable } from 'react-native';
import { Anime } from '../types';
import theme from '../theme';

type Props = {
  item: Anime;
  onPress?: () => void;
  right?: React.ReactNode;
  variant?: 'default' | 'dark';
};

export default function AnimeCard({ item, onPress, right }: Props) {
  const img =
    item.images?.jpg?.image_url ??
    item.images?.webp?.image_url ??
    undefined;

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        marginVertical: 6,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
      }}
    >
      <Image
        source={{ uri: img }}
        style={{ width: 64, height: 92, borderRadius: 8, backgroundColor: '#eee' }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600', fontSize: 16, color: theme.colors.text }} numberOfLines={2}>
          {item.title}
        </Text>
        {item.year ? (
          <Text style={{ color: theme.colors.muted, marginTop: 2 }}>{item.year}</Text>
        ) : null}
        {item.score != null ? (
          <Text style={{ color: theme.colors.muted, marginTop: 2 }}>⭐ {item.score}</Text>
        ) : null}
        {right ? <View style={{ marginTop: 8 }}>{right}</View> : null}
      </View>
    </Pressable>
  );
}
