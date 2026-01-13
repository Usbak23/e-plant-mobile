import { theme } from '@app/presentations/utils/styles'
import { Menu, Text } from '@app/presentations/_shared-components'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native'
import { Menus } from './menu-list'
import MenuWrapper from '@app/presentations/_shared-components/Menu/wrapper'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  useCurrentUserInfo,
  useIsAllowedToSeeAbsensi,
  useIsAllowedToSeeFieldReport
} from '@app/domain/states/user/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { ROLE_ACCESS_SLUG } from '@app/models/eplant/Role'
import Routes from '@app/presentations/navigation/Routes'
import { actions, RootStateType } from '@app/domain/states/store'
import { database } from '@root/index'
import { ITPHRowAll } from '@app/models/eplant/TPH'

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const HomePage = () => {
  const db = database
  const tphCollections = db.collections.get('tphs')
  // const isAllowedToSeeRKH = useIsAllowedToSeeRKH()
  const isAllowedToSeeAbsensi = useIsAllowedToSeeAbsensi()
  const isAllowedToSeeFieldReport = useIsAllowedToSeeFieldReport()
  const navigation = useNavigation()
  // const userData = useUserDataCredential()
  const currentUser = useCurrentUserInfo()
  const dispatch = useDispatch()
  const isFocused = useIsFocused() // using is focused because we need latest data on BE
  const [dimensions, setDimensions] = useState({ window, screen })

  const { tphAll } = useSelector((state: RootStateType) => state?.tph)

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen })
    })
    return () => subscription?.remove()
  })

  const constructMenus = () => {
    const temps = []
    let x = []
    Menus.forEach((menu, index) => {
      if (menu.slug == ROLE_ACCESS_SLUG.SEE_ABSENSI || menu.slug == ROLE_ACCESS_SLUG.SEE_WAREHOUSE_MANAGEMENT) {
        if (menu.slug == ROLE_ACCESS_SLUG.SEE_ABSENSI && isAllowedToSeeAbsensi) {
          x.push(menu)
        } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_WAREHOUSE_MANAGEMENT && isAllowedToSeeFieldReport) {
          x.push(menu)
        }
      } else {
        x.push(menu)
      }

      if (dimensions.window.height > dimensions.window.width ? x.length == 2 : x.length == 4) {
        temps.push(x)
        x = []
      }

      if (index == Menus.length - 1) {
        temps.push(x)
        x = []
      }
    })

    return temps
  }

  const constructInitial = () => {
    const splitted = currentUser?.name ? currentUser.name.split(' ') : []
    if (splitted && splitted.length > 0) {
      if (splitted.length > 1) {
        return `${splitted[0][0] || ''}${splitted[1][0] || ''}`.toUpperCase()
      }
      return `${splitted[0][0]}`.toUpperCase()
    }
    return ''
  }

  const GreetingText = () => (
    <View style={styles.greetingView}>
      <Text color="white">{currentUser?.name || 'User'}</Text>
      <Text color={theme.colors.thirdWhiteTransparent}>Selamat datang di E-Plantation</Text>
    </View>
  )

  const InitialProfileView = () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.PROFILE_STACK)
      }}>
      <View style={[{ alignItems: 'center' }, styles.profilePicView]}>
        <Text size={12} color={theme.colors.white} type="semibold">
          {constructInitial()}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const ImageView = () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.PROFILE_STACK)
      }}>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={styles.image}
          source={{ uri: currentUser?.imageProfile ? `data:image/png;base64,${currentUser?.imageProfile}` : '' }}
          resizeMode={'cover'}
        />
      </View>
    </TouchableOpacity>
  )

  const ProfilePicView = () => {
    return currentUser?.imageProfile ? <ImageView /> : <InitialProfileView />
  }

  const HeaderLeft = () => <Image source={require('@assets/icons/sag.png')} style={styles.arvisLogoImg} />

  useEffect(() => {
    const restoreData = async () => {
      if (tphAll?.data == undefined || tphAll?.data?.length == 0) { //tph is empty. we need to get from database and restore it
        tphCollections.query().fetch().then(r => {
          if (r.length > 0) {
            const pruned: ITPHRowAll[] = []
            r.forEach((tph, index) => {
              pruned.push({
                id: tph._raw.id,
                name: tph._raw.name || '',
                block: JSON.parse(tph._raw.block)
              })
            })
            dispatch(actions.getTPHAll.success({ loading: false, data: pruned }))
          }
        })

      }
    }

    restoreData()

  }, [])

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.fetchAllDataForOfflineMode())
    }
  }, [isFocused])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDark }}>
      <ScrollView style={{ backgroundColor: 'white', marginBottom: -100 }} showsVerticalScrollIndicator={false}>
        <StatusBar animated={true} backgroundColor={theme.colors.backgroundDark} barStyle="light-content" />
        <View style={styles.headerBg}>
          <View style={styles.headerView}>
            <HeaderLeft />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ProfilePicView />
            </View>
          </View>
          <GreetingText />
        </View>

        <View style={styles.menuView}>
          {constructMenus().map((menu, index) => (
            <MenuWrapper key={index}>
              {menu.map((item, i) => (
                <Menu key={i} menuItem={item} />
              ))}
            </MenuWrapper>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomePage

const styles = StyleSheet.create({
  headerBg: {
    width: '100%',
    position: 'absolute',
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: theme.colors.backgroundDark,
    padding: 25,
  },
  arvisLogoImg: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  headerView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greetingView: {
    marginVertical: 32,
  },
  menuView: {
    marginHorizontal: 16,
    marginTop: 150,
    marginBottom: 130,
  },
  profilePicView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    height: 32,
    width: 32,
    borderRadius: 16,
    padding: 2,
  },
  image: {
    width: 32,
    height: 32,
    borderColor: theme.colors.textThinBlack,
    borderWidth: 2,
    borderRadius: 16,
  },
})
