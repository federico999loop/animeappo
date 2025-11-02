import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import theme from '../theme';

type Props = {
  title?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  transparent?: boolean;
};

export default function AppBar({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false
}: Props) {
  const insets = useSafeAreaInsets();
  const statusBarStyle = theme.dark ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <View style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: transparent ? 'transparent' : theme.colors.elevation.level1,
          borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: transparent ? 'transparent' : theme.colors.border,
        },
        transparent && styles.transparent
      ]}>
        <View style={styles.content}>
          {leftIcon ? (
            <IconButton
              icon={leftIcon}
              size={24}
              onPress={onLeftPress}
              iconColor={theme.colors.text}
            />
          ) : <View style={styles.placeholder} />}
          
          {title && (
            <Text style={[
              theme.typography.h3,
              styles.title,
              { color: theme.colors.text }
            ]}>
              {title}
            </Text>
          )}
          
          {rightIcon ? (
            <IconButton
              icon={rightIcon}
              size={24}
              onPress={onRightPress}
              iconColor={theme.colors.text}
            />
          ) : <View style={styles.placeholder} />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1000,
  },
  transparent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 48,
    height: 48,
  },
});