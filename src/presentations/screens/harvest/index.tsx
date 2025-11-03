import {
  useIsAllowedToSeeBKMHarvest,
  useIsAllowedToSeeBPBKS,
  useIsAllowedToSeePMA,
  useIsAllowedToSeeTonnageGarden,
  useIsAllowedToSeeTonnagePKS,
} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
import {Header, Menu} from '@app/presentations/_shared-components'
import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import React, {useEffect, useState} from 'react'
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {harvestMenus} from './harvest-menus'
const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const HarvestModulePage = () => {
  const isAllowedToSeeBKMHarvest = useIsAllowedToSeeBKMHarvest()
  const isAllowedToSeePMA = useIsAllowedToSeePMA()
  const isAllowedToSeeBPBKS = useIsAllowedToSeeBPBKS()
  const isAllowedToSeeTonnageGarden = useIsAllowedToSeeTonnageGarden()
  const isAllowedToSeeTonnagePKS = useIsAllowedToSeeTonnagePKS()

  const [dimensions, setDimensions] = useState({window, screen})

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => subscription?.remove()
  })

  const HeaderView = () => (
    <Header title="Panen" headerRight={() => <ProfileRightHeader />} style={{marginHorizontal: -12}} />
  )

  const constructMenus = harvestMenus.filter(menu => {
    if (menu.slug == ROLE_ACCESS_SLUG.SEE_BKM_HARVEST) {
      return isAllowedToSeeBKMHarvest
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_PMA) {
      return isAllowedToSeePMA
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_BPBKS) {
      return isAllowedToSeeBPBKS
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_TONNAGE_GARDEN) {
      return isAllowedToSeeTonnageGarden
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_TONNAGE_PKS) {
      return isAllowedToSeeTonnagePKS
    }
    return true
  })

  const renderItem = ({item, index}: any) => <Menu key={index.toString()} menuItem={item} />

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.menuView}>
        <HeaderView />
        {dimensions.window.height > dimensions.window.width ? (
          <FlatList
            key="v"
            numColumns={2}
            data={constructMenus}
            contentContainerStyle={{paddingBottom: 100}}
            keyExtractor={item => item.title}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            key="h"
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

export default HarvestModulePage

const styles = StyleSheet.create({
  menuView: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
})
