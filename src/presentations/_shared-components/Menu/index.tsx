import {theme} from '@app/presentations/utils/styles'
import {useNavigation} from '@react-navigation/core'
import React from 'react'
import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {Text} from '..'

interface IMenuProps {
  menuItem: {
    icon: any
    title: string
    screen: string
    bgColor: string
  }
  columns?: number
}

const Menu: React.FC<IMenuProps> = props => {
  const navigation = useNavigation()
  const {icon, title, screen, bgColor} = props.menuItem
  const {width, height} = useWindowDimensions()
  const isWide = width >= 600 || width > height
  const numColumns = props.columns || (isWide ? 4 : 2)

  // Pada HP Portrait: tetap width / 2.45 persis seperti semula
  // Pada Tablet / Landscape: hitung lebar pas 4 kolom (maksimal 200dp)
  const cardSize = isWide
    ? Math.min((width - 32 - numColumns * 20) / numColumns, 200)
    : width / 2.45

  const onMenuTap = () => {
    //@ts-ignore
    navigation.navigate(screen)
  }

  const Icon = icon

  return (
    <TouchableOpacity
      onPress={onMenuTap}
      activeOpacity={0.5}
      style={[
        styles.container,
        {
          width: cardSize,
          height: cardSize,
        },
      ]}>
      <View
        style={{
          marginVertical: isWide ? 6 : 10,
          padding: isWide ? 18 : 26,
          borderRadius: 12,
          backgroundColor: bgColor,
        }}>
        <Icon width={isWide ? 40 : 48} height={isWide ? 40 : 48} />
      </View>
      <Text
        maxLines={2}
        type="semibold"
        size={isWide ? 11 : 12}
        color={theme.colors.textThinBlack}
        style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default Menu

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemContainer: {
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    marginTop: 4,
    textAlign: 'center',
  },
})
