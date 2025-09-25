import React from 'react'
import {StyleSheet, View} from 'react-native'
import Menu from '..'
import {Text} from '../..'

interface IMenuWrapperProps {
  children: any
}

const MenuWrapper: React.FC<IMenuWrapperProps> = props => {
  return <View style={styles.container}>{props.children}</View>
}

export default MenuWrapper

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
  },
})
