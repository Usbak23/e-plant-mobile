import {
  useIsAllowedToSeeListOfRequest,
  useIsAllowedToSeeMyRequest,
  useIsAllowedToSeeWarehouseManagement,
} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
import {theme} from '@app/presentations/utils/styles'
import {Header, Menu} from '@app/presentations/_shared-components'
import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import React from 'react'
import {FlatList, SafeAreaView, StyleSheet, View, useWindowDimensions} from 'react-native'
import {RequestMenus} from './request-menus'

const RequestPage = () => {
  const isAllowedToSeeMyRequest = useIsAllowedToSeeMyRequest()
  const isAllowedToSeeListOfRequestRequest = useIsAllowedToSeeListOfRequest()
  const isAllowedToSeeWarehouseManagement = useIsAllowedToSeeWarehouseManagement()

  const {width, height} = useWindowDimensions()
  const isWide = width >= 600 || width > height

  const constructMenus = RequestMenus.filter(menu => {
    if (menu.slug == ROLE_ACCESS_SLUG.SEE_MY_REQUEST) {
      return isAllowedToSeeMyRequest
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_LIST_OF_REQUEST) {
      return isAllowedToSeeListOfRequestRequest
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_WAREHOUSE_MANAGEMENT) {
      return isAllowedToSeeWarehouseManagement
    }
    return true
  })

  const renderItem = ({item, index}: any) => (
    <Menu key={index.toString()} menuItem={item} columns={isWide ? 4 : 2} />
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Gudang" headerRight={() => <ProfileRightHeader />} />
      <View style={styles.body}>
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

export default RequestPage

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  body: {
    paddingHorizontal: 16,
  },
})
