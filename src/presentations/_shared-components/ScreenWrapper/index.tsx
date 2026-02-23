import React, {ReactNode} from 'react'
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {theme} from '@styles'

interface IScreenWrapperProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  useSafeArea?: boolean
  backgroundColor?: string
}

const ScreenWrapper: React.FC<IScreenWrapperProps> = ({
  children,
  style,
  useSafeArea = true,
  backgroundColor = theme.colors.background,
}) => {
  if (useSafeArea) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor}, style]}>
        {children}
      </SafeAreaView>
    )
  }

  return <View style={[styles.container, {backgroundColor}, style]}>{children}</View>
}

export default ScreenWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
