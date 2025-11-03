import {Header, Menu} from '@app/presentations/_shared-components'
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, FlatList, StatusBar, Dimensions} from 'react-native'
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

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const MasterData = () => {
  const isAllowedToSeeOrganization = useIsAllowedToSeeOrganization()
  const isAllowedToSeeDivision = useIsAllowedToSeeDivision()
  const isAllowedToSeeBlock = useIsAllowedToSeeBlock()
  const isAllowedToSeeTPH = useIsAllowedToSeeTPH()
  const isAllowedToSeeMaterial = useIsAllowedToSeeMaterial()
  const isAllowedToSeeToolsAndItems = useIsAllowedToSeeToolsAndItems()

  const renderItem = ({item, index}: any) => <Menu key={index.toString()} menuItem={item} />

  const [dimensions, setDimensions] = useState({window, screen})

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => subscription?.remove()
  })

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
        {dimensions.window.height > dimensions.window.width ? (
          <FlatList
            key={'v'}
            numColumns={2}
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
