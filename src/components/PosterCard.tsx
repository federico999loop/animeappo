import React, { useRef } from 'react';
import { View, Image, Text, Pressable, Animated, Platform } from 'react-native';
import { Anime } from '../types';
import theme from '../theme';

type Props = {
  item: Anime;
  onPress?: () => void;
  width?: number;
};

export default function PosterCard({ item, onPress, width = 160 }: Props) {
  const img =
    item.images?.jpg?.large_image_url ?? item.images?.jpg?.image_url ?? item.images?.webp?.image_url ?? undefined;
  const rating = item.score ?? null;
  const scale = useRef(new Animated.Value(1)).current;

  function animateTo(toValue: number) {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 20, bounciness: 8 } as any).start();
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(0.96)}
      onPressOut={() => animateTo(1)}
      onFocus={() => animateTo(1.05)}
      onBlur={() => animateTo(1)}
      style={{ marginRight: 12 }}
    >
      <Animated.View style={{ transform: [{ scale }], width, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.colors.soft }}>
        {img ? (
          <Image source={{ uri: img }} style={{ width, height: Math.round(width * 1.45), backgroundColor: '#111' }} />
        ) : (
          <View style={{ width, height: Math.round(width * 1.45), backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#9ca3af', fontWeight: '700' }}>No Image</Text>
          </View>
        )}
        {rating != null ? (
          <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{rating.toFixed(1)}</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
