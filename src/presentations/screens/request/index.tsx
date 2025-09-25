import {
  useIsAllowedToSeeListOfRequest,
  useIsAllowedToSeeMyRequest,
  useIsAllowedToSeeWarehouseManagement,
} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
import {theme} from '@app/presentations/utils/styles'
import {Header, Menu} from '@app/presentations/_shared-components'
import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import React, {useEffect, useState} from 'react'
import {Dimensions, FlatList, SafeAreaView, StyleSheet, View} from 'react-native'
import {RequestMenus} from './request-menus'

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const RequestPage = () => {
  const isAllowedToSeeMyRequest = useIsAllowedToSeeMyRequest()
  const isAllowedToSeeListOfRequestRequest = useIsAllowedToSeeListOfRequest()
  const isAllowedToSeeWarehouseManagement = useIsAllowedToSeeWarehouseManagement()

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
  const [dimensions, setDimensions] = useState({window, screen})

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => subscription?.remove()
  })

  const renderItem = ({item, index}: any) => <Menu key={index.toString()} menuItem={item} />

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Gudang" headerRight={() => <ProfileRightHeader />} />
      <View style={styles.body}>
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
