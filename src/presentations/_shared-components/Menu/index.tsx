import {theme} from '@app/presentations/utils/styles'
import {useNavigation} from '@react-navigation/core'
import React from 'react'
import {Dimensions, StyleSheet, View} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {Text} from '..'
const {width} = Dimensions.get('window')
interface IMenuProps {
  menuItem: {
    icon: any
    title: string
    screen: string
    bgColor: string
  }
}

const Menu: React.FC<IMenuProps> = props => {
  const navigation = useNavigation()
  const {icon, title, screen, bgColor} = props.menuItem

  const onMenuTap = () => {
    //@ts-ignore
    navigation.navigate(screen)
  }

  const Icon = icon;

  return (
    <TouchableOpacity onPress={onMenuTap} activeOpacity={0.5} style={styles.container}>
      <View style={{marginVertical: 10, padding: 26, borderRadius: 12, backgroundColor: bgColor}}>
        <Icon width={48} height={48} />
      </View>
      <Text maxLines={2} type="semibold" size={12} color={theme.colors.textThinBlack} style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default Menu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: width / 2.45,
    width: width / 2.45,
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
