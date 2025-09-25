import {IItemRow} from '@app/models/eplant/Item'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import {ListFilter, ListFilterAlt, Text} from '@app/presentations/_shared-components'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import {useNavigation} from '@react-navigation/core'
import React, {useState} from 'react'
import {Animated, GestureResponderHandlers, RefreshControl, StyleSheet, View} from 'react-native'
import {PanGestureHandler, ScrollView} from 'react-native-gesture-handler'
import {MenuOption, MenuOptions} from 'react-native-popup-menu'
import AntDesign from 'react-native-vector-icons/AntDesign'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'

import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {onChange} from 'react-native-reanimated'

interface IContentTabProps {
  listPanResponder: any
  numColumns?: number
  listRefArr: any
  route: any
  scrollY: any
  focused: any
  onMomentumScrollBegin: () => void
  onScrollEndDrag: () => void
  onMomentumScrollEnd: () => void
  HeaderHeight: number
  TabBarHeight: number
  data: any
  renderItem: any
  windowHeight: any
  limit: number
  onNextPage?: () => void
  item?: IItemRow
  loading?: boolean
  page: number
  onRefresh: Function
  onOpenFilter: Function
  onOpenSort: Function
  onHandleSearch: Function
  searchValue: string
  onOpenNew: Function
  isCheckup: boolean
  isAllowedToOrganize?: boolean
}

const schema = yup.object().shape({
  search: yup.string().required('Search is required'),
})

const ItemContentTabWrapper: React.FC<IContentTabProps> = props => {
  const {
    listPanResponder,
    numColumns,
    listRefArr,
    route,
    focused,
    scrollY,
    onMomentumScrollBegin,
    onScrollEndDrag,
    onMomentumScrollEnd,
    HeaderHeight,
    TabBarHeight,
    data,
    renderItem,
    windowHeight,
    limit,
    onNextPage,
    item,
    loading,
    page,
    onRefresh,
    onOpenFilter,
    onOpenSort,
    onHandleSearch,
    searchValue,
    onOpenNew,
    isCheckup,
    isAllowedToOrganize,
  } = props

  const AltOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      {props.isAllowedToOrganize && (
        <MenuOption
          key={0}
          onSelect={() => {
            onOpenNew && onOpenNew()
          }}>
          <View style={styles.popupLabel}>
            <AntDesign name="plus" size={15} color={theme.colors.textThinBlack} />
            <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
              Tambah {!isCheckup ? 'Maintenance' : 'Aktivitas Harian'}
            </Text>
          </View>
        </MenuOption>
      )}

      <MenuOption
        key={1}
        onSelect={() => {
          onOpenFilter && onOpenFilter()
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="filter" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Filter
          </Text>
        </View>
      </MenuOption>
      <MenuOption
        key={2}
        onSelect={() => {
          onOpenSort && onOpenSort()
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="swap" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Urutkan
          </Text>
        </View>
      </MenuOption>
    </MenuOptions>
  )

  return (
    <Animated.FlatList
      //   scrollEnabled={true}
      {...listPanResponder.panHandlers}
      numColumns={numColumns ? numColumns : null}
      ref={ref => {
        if (ref) {
          const found = listRefArr.current.find((e: any) => e.key === route.key)
          if (!found) {
            listRefArr.current.push({
              key: route.key,
              value: ref,
            })
          }
        }
      }}
      scrollEventThrottle={16}
      onScroll={
        focused
          ? Animated.event(
              [
                {
                  nativeEvent: {contentOffset: {y: scrollY}},
                },
              ],
              {useNativeDriver: true},
            )
          : null
      }
      onMomentumScrollBegin={onMomentumScrollBegin}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
      ItemSeparatorComponent={() => <View style={{height: 10}} />}
      ListHeaderComponent={
        <ListFilterAlt
          disableMargin={true}
          style={styles.filter}
          searchValue={searchValue}
          onChangeSearch={v => {
            onHandleSearch(v)
          }}
          onPressFilter={() => {}}
          alts={AltOptions}
        />
      }
      contentContainerStyle={{
        paddingTop: HeaderHeight + TabBarHeight,
        paddingHorizontal: 10,
        // minHeight: windowHeight + HeaderHeight,
        minHeight: windowHeight - 100 + (HeaderHeight + 900),
      }}
      ListFooterComponent={() => <FlatListFooter loading={Boolean(data?.length > 0 && Boolean(loading))} />}
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={limit}
      onEndReachedThreshold={0.5}
      onEndReached={onNextPage && onNextPage()}
    />
  )
}

export default ItemContentTabWrapper

const styles = StyleSheet.create({
  filter: {marginTop: 8},
  popupLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    padding: 8,
  },
})
