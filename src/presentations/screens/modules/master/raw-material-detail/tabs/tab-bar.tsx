import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import {TabBar} from 'react-native-tab-view'

interface ITabBarProps {
  scrollY: any
  HeaderHeight: number
  TabBarHeight: number
  isListGliding: any
}

const CustomTabBar: React.FC<ITabBarProps> = props => {
  const {scrollY, HeaderHeight, TabBarHeight, isListGliding} = props
  const y = scrollY.interpolate({
    inputRange: [0, HeaderHeight],
    outputRange: [HeaderHeight, 0],
    extrapolate: 'clamp',
  })

  const renderLabel = ({route, focused}: any) => {
    return (
      <Text maxLines={1} style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
        {route.title}
      </Text>
    )
  }
  return (
    <Animated.View
      style={{
        top: 0,
        zIndex: 1,
        position: 'absolute',
        transform: [{translateY: y}],
        width: '100%',
      }}>
      <TabBar
        {...props}
        onTabPress={({route, preventDefault}) => {
          if (isListGliding.current) {
            preventDefault()
          }
        }}
        style={[{height: TabBarHeight}, styles.tab]}
        renderLabel={renderLabel}
        indicatorStyle={styles.indicator}
      />
    </Animated.View>
  )
}

export default CustomTabBar

const styles = StyleSheet.create({
  indicator: {backgroundColor: theme.colors.black},
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: 'white',
  },
  label: {fontSize: 14, color: '#222'},
})
