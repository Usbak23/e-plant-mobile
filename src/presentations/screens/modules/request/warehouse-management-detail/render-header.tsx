import {IItemRow} from '@app/models/eplant/Item'
import {IManagementWarehouse, IManagementWarehouseDetail} from '@app/models/eplant/WarehouseManagement'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {Animated, StyleSheet, TouchableOpacity} from 'react-native'
import WarehouseManagementDetailInfo from './warehouse-management-detail-info'

interface IItemRenderHeaderProps {
  scrollY: any
  HeaderHeight: any
  headerPanResponder: any
  item?: IManagementWarehouse
  itemDetail?: IManagementWarehouseDetail
  parent?: any
  onMoreTap?: Function
  onAccept?: Function
  onDownload?: Function
  isAllowedToOrganize?: boolean
}
const WarehouseRenderHeader: React.FC<IItemRenderHeaderProps> = props => {
  const {scrollY, HeaderHeight, headerPanResponder} = props
  const y = scrollY.interpolate({
    inputRange: [0, HeaderHeight],
    outputRange: [0, -HeaderHeight],
    extrapolate: 'clamp',
  })

  return (
    <Animated.View
      {...headerPanResponder.panHandlers}
      style={[{height: HeaderHeight}, styles.header, {transform: [{translateY: y}]}]}>
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} activeOpacity={1} onPress={() => {}}>
        <WarehouseManagementDetailInfo
          item={props?.item}
          itemDetail={props?.itemDetail}
          parent={props?.parent}
          onMoreTap={props.onMoreTap}
          onAccept={props.onAccept}
          onDownload={props?.onDownload}
          isAllowedToOrganize={props?.isAllowedToOrganize}
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

export default WarehouseRenderHeader

const styles = StyleSheet.create({
  header: {
    width: '100%',
    position: 'absolute',
  },
})
