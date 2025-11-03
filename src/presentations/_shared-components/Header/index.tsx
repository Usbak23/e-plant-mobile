import React from 'react'
import {StyleSheet, TouchableOpacity, View, StyleProp, ViewStyle} from 'react-native'
import {Text} from '..'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {theme} from '@app/presentations/utils/styles'
import {useNavigation} from '@react-navigation/core'

interface IHeaderProps {
  title: string
  headerRight?: () => JSX.Element | false | undefined
  onGoBack?: () => void
  hideBackButton?: boolean
  style?: StyleProp<ViewStyle>
}

const Header: React.FC<IHeaderProps> = props => {
  const navigation = useNavigation()

  const goBack = () => {
    props.onGoBack ? props.onGoBack() : navigation.goBack()
  }
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.leftContent}>
        {props?.hideBackButton ? null : (
          <TouchableOpacity onPress={goBack} testID="headerBackButton">
            <Icon name={'chevron-left'} size={22} color={theme.colors.black} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{flex: 1, flexGrow: 10, alignItems: 'center'}}>
        <Text maxLines={2} style={{paddingHorizontal: 8, textAlign: 'center'}} type="semibold">
          {props.title}
        </Text>
      </View>

      <View style={styles.rightContent}>{props.headerRight && props.headerRight()}</View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  rightContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
