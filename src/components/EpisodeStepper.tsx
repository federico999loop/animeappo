import { View, Text, Pressable } from 'react-native';
import theme from '../theme';

type Props = {
  value: number;
  max?: number | null;
  onChange: (next: number) => void;
};

export default function EpisodeStepper({ value, max, onChange }: Props) {
  const dec = () => onChange(Math.max(0, value - 1));
  const inc = () => onChange(max && max > 0 ? Math.min(max, value + 1) : value + 1);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Pressable
        onPress={dec}
        style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: theme.colors.soft, borderRadius: 8 }}
      >
        <Text style={{ fontSize: 18, color: theme.colors.text }}>−</Text>
      </Pressable>
      <Text style={{ minWidth: 48, textAlign: 'center', fontWeight: '600', color: theme.colors.text }}>
        {value}{max ? ` / ${max}` : ''}
      </Text>
      <Pressable
        onPress={inc}
        style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: theme.colors.soft, borderRadius: 8 }}
      >
        <Text style={{ fontSize: 18, color: theme.colors.text }}>＋</Text>
      </Pressable>
    </View>
  );
}
