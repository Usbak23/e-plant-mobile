import {useIsAllowedToSeeBKMTakeCare, useIsAllowedToSeeFertilizationRealization} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
import {Header, Menu} from '@app/presentations/_shared-components'
import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import React from 'react'
import {FlatList, StatusBar, StyleSheet, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {harvestMenus} from './harvest-menus'

const TakeCareModulePage = () => {
  const isAllowedToSeeBKMTakeCare = useIsAllowedToSeeBKMTakeCare()
  const isAllowedToSeeFertilizationRealization = useIsAllowedToSeeFertilizationRealization()

  const constructMenus = harvestMenus.filter(menu => {
    if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BKM_TAKE_CARE) {
      return isAllowedToSeeBKMTakeCare
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_FERTILIZATION_REALIZATION) {
      return isAllowedToSeeFertilizationRealization
    }
  })
  const HeaderView = () => (
    <Header title="Rawat" headerRight={() => <ProfileRightHeader />} style={{marginHorizontal: -12}} />
  )

  const renderItem = ({item, index}: any) => <Menu key={index.toString()} menuItem={item} />

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.menuView}>
        <HeaderView />
        <FlatList
          numColumns={2}
          data={constructMenus}
          contentContainerStyle={{paddingBottom: 100}}
          keyExtractor={item => item.title}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  )
}

export default TakeCareModulePage

const styles = StyleSheet.create({
  menuView: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
})
