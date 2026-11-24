import {Header, Menu} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View, FlatList, StatusBar, useWindowDimensions} from 'react-native'
import {MasterDataMenus} from './master-data-menus'

import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import {SafeAreaView} from 'react-native-safe-area-context'
import {
  useIsAllowedToSeeBlock,
  useIsAllowedToSeeDivision,
  useIsAllowedToSeeMaterial,
  useIsAllowedToSeeOrganization,
  useIsAllowedToSeeToolsAndItems,
  useIsAllowedToSeeTPH,
} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'

const MasterData = () => {
  const isAllowedToSeeOrganization = useIsAllowedToSeeOrganization()
  const isAllowedToSeeDivision = useIsAllowedToSeeDivision()
  const isAllowedToSeeBlock = useIsAllowedToSeeBlock()
  const isAllowedToSeeTPH = useIsAllowedToSeeTPH()
  const isAllowedToSeeMaterial = useIsAllowedToSeeMaterial()
  const isAllowedToSeeToolsAndItems = useIsAllowedToSeeToolsAndItems()

  const {width, height} = useWindowDimensions()
  const isWide = width >= 600 || width > height

  const renderItem = ({item, index}: any) => (
    <Menu key={index.toString()} menuItem={item} columns={isWide ? 4 : 2} />
  )

  const constructMenus = MasterDataMenus.filter(menu => {
    if (menu.slug == ROLE_ACCESS_SLUG.SEE_ORGANIZATION) {
      return isAllowedToSeeOrganization
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_DIVISION) {
      return isAllowedToSeeDivision
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_BLOCK) {
      return isAllowedToSeeBlock
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_TPH) {
      return isAllowedToSeeTPH
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_MATERIAL) {
      return isAllowedToSeeMaterial
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_ALAT) {
      return isAllowedToSeeToolsAndItems
    }
    return true
  })

  const HeaderView = () => (
    <Header title="Master Data" headerRight={() => <ProfileRightHeader />} style={{marginHorizontal: -12}} />
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

export default MasterData

const styles = StyleSheet.create({
  menuView: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
})
