import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  rating: number;
  onRate: (rating: number) => void;
  size?: number;
  color?: string;
};

export default function StarRating({ rating, onRate, size = 32, color = '#f5c518' }: Props) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onRate(index)}
          onPressIn={() => setHoverRating(index)}
          onPressOut={() => setHoverRating(0)}
        >
          <MaterialCommunityIcons
            name={index <= (hoverRating || rating) ? 'star' : 'star-outline'}
            size={size}
            color={color}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
