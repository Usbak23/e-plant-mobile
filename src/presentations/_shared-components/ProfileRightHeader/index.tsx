import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Text} from '..'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CircleAvatar from '../CircleAvatar'
import {useSelector} from 'react-redux'
import {RootStateType} from '@app/domain/states/store'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'

interface IProfileHeaderRightProps {
  useLightIcon?: boolean
}

const ProfileRightHeader: React.FC<IProfileHeaderRightProps> = props => {
  const user = useCurrentUserInfo()

  const constructInitial = () => {
    const splitted = user?.name ? user.name.split(' ') : []
    if (splitted && splitted.length > 0) {
      if (splitted.length > 1) {
        return `${splitted[0][0] || ''}`.toUpperCase()
      }
      return `${splitted[0][0]}`.toUpperCase()
    }
    return ''
  }

  const InitialProfileView = () => (
    <View style={{alignItems: 'center'}}>
      <View style={styles.profilePicView}>
        <Text size={14} color={theme.colors.white} type="semibold">
          {constructInitial()}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={{marginEnd: 8}} onPress={() => {}}>
        <Icon name={'notifications'} size={22} color={props.useLightIcon ? theme.colors.white : theme.colors.black} />
      </TouchableOpacity> */}
      {user?.imageProfile ? <CircleAvatar imageUrl={user?.imageProfile} /> : <InitialProfileView />}
    </View>
  )
}

export default ProfileRightHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    height: 28,
    width: 28,
    borderRadius: 18,
    // padding: 4,
  },
})
