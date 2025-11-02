import React, { useRef } from 'react';
import { View, Image, Text, Pressable, Animated } from 'react-native';
import { Anime } from '../types';
import theme from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

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
    Animated.spring(scale, { 
      toValue, 
      useNativeDriver: true, 
      speed: 20, 
      bounciness: 8 
    } as any).start();
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(theme.animations.scale.pressed)}
      onPressOut={() => animateTo(1)}
      onFocus={() => animateTo(theme.animations.scale.focused)}
      onBlur={() => animateTo(1)}
      style={{ marginRight: theme.spacing.sm }}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
            width,
            borderRadius: theme.radii.xl,
            overflow: 'hidden',
            backgroundColor: theme.colors.elevation.level1,
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          theme.shadows.md,
        ]}
      >
        <View style={{ position: 'relative' }}>
          {img ? (
            <Image 
              source={{ uri: img }} 
              style={{ 
                width, 
                height: Math.round(width * 1.45),
                backgroundColor: theme.colors.surfaceVariant,
                borderTopLeftRadius: theme.radii.xl,
                borderTopRightRadius: theme.radii.xl,
              }}
            />
          ) : (
            <View style={{
              width,
              height: Math.round(width * 1.45),
              backgroundColor: theme.colors.surfaceVariant,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={[
                theme.typography.body2,
                { color: theme.colors.textSecondary }
              ]}>No Image</Text>
            </View>
          )}
          
          <LinearGradient
            colors={['rgba(12,10,16,0)', 'rgba(12,10,16,0.85)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
            }}
          />

          {rating != null && (
            <View style={{
              position: 'absolute',
              top: theme.spacing.sm,
              right: theme.spacing.sm,
              borderRadius: theme.radii.pill,
              overflow: 'hidden',
            }}>
              <LinearGradient
                colors={theme.colors.gradients.accent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  gap: theme.spacing.xs,
                }}
              >
                <Text style={{ color: theme.colors.white }}>★</Text>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.white },
                  ]}
                >
                  {rating.toFixed(1)}
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>

        <View
          style={{
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.md,
            backgroundColor: 'transparent',
          }}
        >
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing.xs,
              }
            ]}
          >
            {item.title}
          </Text>
          {item.episodes && (
            <Text style={[
              theme.typography.caption,
              { color: theme.colors.textSecondary }
            ]}>{item.episodes} episodi</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}
