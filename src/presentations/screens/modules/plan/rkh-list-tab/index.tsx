import React, {useState, useRef, useEffect} from 'react'
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native'
import Header from '@components/Header'
import Text from '@components/Text'
import Entypo from 'react-native-vector-icons/Entypo'
import ListFilter from '@components/ListFilter'
import {theme} from '@app/presentations/utils/styles'
import {SceneMap, TabView} from 'react-native-tab-view'
import {useIsFocused, useRoute} from '@react-navigation/core'
import {useRangeMonths} from '@app/domain/states/master/hooks'
import RKHHarvestList from '../rkh-harvest-list'
import RKHTakeCareList from '../rkh-take-care-list'
import moment from 'moment'
import {MenuOptions} from 'react-native-popup-menu'
import {sortOptions} from './sort-options'
import {SortPopup} from '@app/presentations/_shared-components'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
import {useCurrentUserInfo, useIsAllowedToOrganizeRKH} from '@app/domain/states/user/hooks'
import {useRKHTakeCareAll} from '@app/domain/states/rkh-take-care/hooks'

export default function RKHListTab() {
  const isAllowedToOrganizeRKH = useIsAllowedToOrganizeRKH()
  const currentUser = useCurrentUserInfo()

  const route: any = useRoute()
  const [tabIdx, setTabIdx] = useState(0)
  const [searchValue, setSearch] = useState('')
  const [sortValue, setSortValue] = useState('name:asc')
  const [_, forceUpdate] = useState(false)
  const isFocused = useIsFocused()
  const item = route.params?.item
  const title = `RKH - ${moment(route.params?.dateRkh).format('D MMMM YYYY')}`
  const THE_DOCS = () => {
    const result = useRKHTakeCareAll(item?.dateRkh, item?.divisionId)
    return result
  }

  const RKHHarvestListRef: any = useRef()
  const RKHTakeCareListRef: any = useRef()

  const isAllowedToCreateRKH = () => {
    // if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    //   return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.TAMBAH_RKH)
    // }
    if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
      return isAllowedToOrganizeRKH
    }

    return false
  }

  const routes = [
    {key: '0', title: 'Panen'},
    {key: '1', title: 'Rawat'},
  ]

  const TabHarvest = () => <RKHHarvestList ref={RKHHarvestListRef} searchValue={searchValue} sortValue={sortValue} />
  const TabTakeCare = () => (
    <RKHTakeCareList ref={RKHTakeCareListRef} searchValue={searchValue} sortValue={sortValue} THE_DOCS={THE_DOCS} />
  )

  const renderScene = SceneMap({
    '0': TabHarvest,
    '1': TabTakeCare,
  })

  const getCurrentRef = () => {
    switch (tabIdx) {
      case 0:
        return RKHHarvestListRef
      case 1:
        return RKHTakeCareListRef
    }
  }
  const currentRef = getCurrentRef()

  const handleSearch = (name: string) => setSearch(name)

  const handleSort = (sort: string) => setSortValue(sort)

  const SortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={sortOptions} selectedValue={sortValue} />
    </MenuOptions>
  )
  useEffect(() => {
    forceUpdate(n => !n)
  }, [])

  useEffect(() => {
    currentRef?.current?.getData
  }, [isFocused, tabIdx])

  return (
    <SafeAreaView style={styles.container}>
      {tabIdx == 0 ? (
        <Header title={title} />
      ) : isAllowedToCreateRKH() ? (
        <Header title={title} headerRight={() => <PlusButton onPress={currentRef?.current?.onAdd} />} />
      ) : (
        <Header title={title} />
      )}

      <ListFilter
        style={styles.filter}
        searchValue={searchValue}
        onChangeSearch={handleSearch}
        onPressDownload={() => {
          currentRef?.current?.showModalExport()
        }}
        sortOptions={SortOptions}
      />
      <TabView
        navigationState={{index: tabIdx, routes}}
        renderScene={renderScene}
        onIndexChange={i => {
          setTabIdx(i)
        }}
        renderTabBar={props => (
          <View style={styles.wrapTab}>
            {props.navigationState.routes.map((e, i) => {
              const isActive = Boolean(i === tabIdx)
              return (
                <TouchableOpacity
                  key={e.title}
                  onPress={() => {
                    setTabIdx(i)
                  }}
                  activeOpacity={0.5}
                  disabled={isActive}
                  style={[styles.tabButton, {backgroundColor: isActive ? theme.colors.primary : '#fff'}]}>
                  <Text style={{fontSize: 13}} color={isActive ? '#fff' : theme.colors.primary}>
                    {e.title}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const PlusButton = ({onPress}: any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Entypo name="plus" size={20} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {marginTop: 16},
  filter: {marginTop: 8},
  tabButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 9,
    flex: 1,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  wrapTab: {flexDirection: 'row', marginHorizontal: 16},
})
