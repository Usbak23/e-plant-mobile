import React from 'react'
import {View, StyleSheet, TouchableOpacity, TextInput, StyleProp, ViewStyle} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {theme} from '@utils/styles'
import {Menu, MenuTrigger} from 'react-native-popup-menu'

interface IProps {
  disableMarginHorizontal?: boolean
  style?: StyleProp<ViewStyle>
  searchValue?: string
  onChangeSearch?: (value: string) => void
  onPressDownload?: () => void
  onPressFilter?: () => void
  sortOptions?: () => JSX.Element | undefined | null
}
export default function ListFilter(props: IProps) {
  const {searchValue, onChangeSearch, onPressDownload, onPressFilter, sortOptions, style} = props

  const FilterButton = () => (
    <TouchableOpacity onPress={onPressFilter} style={styles.button}>
      <MaterialCommunityIcons name="filter-variant" size={14} color={theme.colors.textThinBlack} />
    </TouchableOpacity>
  )
  return (
    <View style={[props?.disableMarginHorizontal ? styles.containerDisableMargin : styles.container, style]}>
      <View style={styles.wrapSearch}>
        <TextInput
          value={searchValue}
          onChangeText={onChangeSearch}
          placeholder="Masukkan kata kunci"
          placeholderTextColor={theme.colors.darkGray}
          style={[
            styles.searhInput,
            {
              fontStyle: searchValue ? 'normal' : 'italic',
            },
          ]}
        />
        <View style={styles.icon}>
          <AntDesign name="search1" size={14} color={theme.colors.textThinBlack} />
        </View>
      </View>
      {onPressDownload && (
        <TouchableOpacity onPress={onPressDownload} style={styles.button}>
          <AntDesign name="download" size={14} color={theme.colors.textThinBlack} />
        </TouchableOpacity>
      )}
      {onPressFilter && <FilterButton />}
      {sortOptions && (
        <Menu>
          <MenuTrigger>
            <View style={styles.button}>
              <AntDesign name="filter" size={14} color={theme.colors.textThinBlack} />
            </View>
          </MenuTrigger>
          {sortOptions && sortOptions()}
        </Menu>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 22,
    flexDirection: 'row',
  },
  containerDisableMargin: {
    flexDirection: 'row',
  },
  wrapSearch: {flex: 1, flexDirection: 'row'},
  button: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    height: 40,
    width: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searhInput: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    color: theme.colors.textThinBlack,
    height: 40,
    width: '100%',
    flex: 1,
    paddingLeft: 35,
  },
  icon: {
    position: 'absolute',
    left: 11,
    top: 14,
  },
})
