import {
  useCurrentUserInfo,
  useIsAllowedToSeeAKP,
  useIsAllowedToSeeCensus,
  useIsAllowedToSeeTaxation,
  useIsAllowedToSeeTPH,
} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
import {Header, Menu} from '@app/presentations/_shared-components'
import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import React from 'react'
import {FlatList, SafeAreaView, StatusBar, StyleSheet, View, useWindowDimensions} from 'react-native'
import {PlanMenus} from './plan-menus'

const PlanModulePage = () => {
  const isAllowedToSeeAKP = useIsAllowedToSeeAKP()
  const isAllowedToSeeTaxation = useIsAllowedToSeeTaxation()
  const isAllowedToSeeCensus = useIsAllowedToSeeCensus()
  const currentUser = useCurrentUserInfo()
  const {width, height} = useWindowDimensions()
  const isWide = width >= 600 || width > height

  const isAllowedToSeeRKH = () => {
    if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
      // for now, only check the rkh access.
      // return currentUser.role.roleModules.some(role => role.slug == ROLE_ACCESS_SLUG.LIHAT_RKH)
      return true
    }
    //default true
    return true
  }

  const constructMenus = PlanMenus.filter(menu => {
    if (menu.slug == ROLE_ACCESS_SLUG.SEE_AKP) {
      return isAllowedToSeeAKP
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_TAXATION) {
      return isAllowedToSeeTaxation
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_CENSUS) {
      return isAllowedToSeeCensus
    }
    // if (menu.slug == ROLE_ACCESS_SLUG.LIHAT_RKH) {
    //   return isAllowedToSeeRKH()
    // }
    return true
  })

  const renderItem = ({item, index}: any) => (
    <Menu key={index.toString()} menuItem={item} columns={isWide ? 4 : 2} />
  )

  const HeaderView = () => (
    <Header title="Rencana" headerRight={() => <ProfileRightHeader />} style={{marginHorizontal: -12}} />
  )
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.menuView}>
        <HeaderView />
        {!isWide ? (
          <FlatList
            key={'v'}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'center'}}
            data={constructMenus}
            contentContainerStyle={{paddingBottom: 100}}
            keyExtractor={item => item.title}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            key={'h'}
            numColumns={4}
            columnWrapperStyle={{justifyContent: 'center'}}
            data={constructMenus}
            contentContainerStyle={{paddingBottom: 100}}
            keyExtractor={item => item.title}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default PlanModulePage

const styles = StyleSheet.create({
  menuView: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
})
