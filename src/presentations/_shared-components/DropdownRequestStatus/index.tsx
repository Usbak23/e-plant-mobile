import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import Text from '../Text'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import PopupEditDelete from '../PopupEditDelete'

interface IProps {
  onAccept?: Function
  onReject?: Function
}

const DropdownRequestStatus = ({onAccept = () => {}, onReject = () => {}}: IProps) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.wrapper}>
          <AntDesign color={theme.colors.yellowDark} name="minuscircle" size={17} />
          <Text maxLines={2} size={11} style={{marginStart: 8}} color={theme.colors.yellowDark} type="bold">
            Menunggu Persetujuan
          </Text>
        </View>
        <Menu>
          <MenuTrigger>
            <View style={{padding: 8}}>
              <Entypo color={theme.colors.yellowDark} name="chevron-down" size={17} />
            </View>
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                padding: 8,
                borderRadius: 10,
              },
            }}>
            <MenuOption onSelect={() => onAccept()}>
              <PopupEditDelete bgIconColor={theme.colors.tealDark} iconName="check" text="Setujui" />
            </MenuOption>
            <MenuOption value={1} onSelect={() => onReject()}>
              <PopupEditDelete bgIconColor={theme.colors.redDark} iconName="close" text="Tolak" />
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  )
}

export default DropdownRequestStatus
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    paddingStart: 16,
    paddingEnd: 4,
    // paddingHorizontal: 16,
    borderRadius: 16,
    margin: 2,
    backgroundColor: theme.colors.accentTransparent,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
