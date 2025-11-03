import React, {useState, useRef, useEffect} from 'react'
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native'
import Header from '@components/Header'
import Text from '@components/Text'
import Entypo from 'react-native-vector-icons/Entypo'
import ListFilter from '@components/ListFilter'
import {theme} from '@app/presentations/utils/styles'
import {SceneMap, TabView} from 'react-native-tab-view'
import CategoryItemList from '../category-item-list'
import MasterItemList from '../master-item-list'
import ItemList from '../item-list'
import {useIsFocused} from '@react-navigation/core'
import {useIsAllowedToOrganizeToolsAndItems} from '@app/domain/states/user/hooks'

export default function ToolsAndEquipment() {
  const isAllowedToOrganizeToolsAndItems = useIsAllowedToOrganizeToolsAndItems()
  const [tabIdx, setTabIdx] = useState(0)
  const [searchValue, setSearch] = useState('')
  const [parentItemType, setParentItemType] = useState('Kendaraan')
  const [_, forceUpdate] = useState(false)
  const isFocused = useIsFocused()

  const categoryItemListRef: any = useRef()
  const masterItemListRef: any = useRef()
  const itemListRef: any = useRef()

  const routes = [
    {key: '0', title: 'Kategori'},
    {key: '1', title: 'Master Item'},
    {key: '2', title: 'Item'},
  ]

  const TabCategory = () => <CategoryItemList ref={categoryItemListRef} />

  const TabMaster = () => <MasterItemList ref={masterItemListRef} />

  const TabItem = () => <ItemList ref={itemListRef} handleType={handleType} itemType={parentItemType} />

  const renderScene = SceneMap({
    '0': TabCategory,
    '1': TabMaster,
    '2': TabItem,
  })

  const getCurrentRef = () => {
    switch (tabIdx) {
      case 0:
        return categoryItemListRef
      case 1:
        return masterItemListRef
      case 2:
        return itemListRef
    }
  }
  const currentRef = getCurrentRef()

  const handleType = (v: string) => {
    setParentItemType(v)
  }

  const handleSearch = (name: string) => {
    setSearch(name)
    currentRef?.current?.handleSearch(name)
  }
  useEffect(() => {
    forceUpdate(n => !n)
  }, [])

  useEffect(() => {
    currentRef?.current?.handleSearch(searchValue)
  }, [isFocused, tabIdx])

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Alat &amp; Perlengkapan"
        headerRight={
          isAllowedToOrganizeToolsAndItems ? () => <PlusButton onPress={currentRef?.current?.onAdd} /> : undefined
        }
      />
      <ListFilter
        style={styles.filter}
        searchValue={searchValue}
        onChangeSearch={handleSearch}
        onPressDownload={() => {
          currentRef?.current?.showModalExport()
        }}
        sortOptions={currentRef?.current?.sortOptions}
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
