import {IItemRow} from '@app/models/eplant/Item'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {Animated, StyleSheet, TouchableOpacity} from 'react-native'
import ItemDetailTransportationInfo from './item-detail-transportation-info'

interface IItemRenderHeaderProps {
  scrollY: any
  HeaderHeight: any
  headerPanResponder: any
  item?: any
  onDelete?: Function
}
const ItemRenderHeader: React.FC<IItemRenderHeaderProps> = props => {
  const {scrollY, HeaderHeight, headerPanResponder} = props
  const y = scrollY.interpolate({
    inputRange: [0, HeaderHeight],
    outputRange: [0, -HeaderHeight],
    extrapolate: 'clamp',
  })

  const deleteItem = () => {
    props.onDelete && props.onDelete()
  }

  return (
    <Animated.View
      {...headerPanResponder.panHandlers}
      style={[{height: HeaderHeight}, styles.header, {transform: [{translateY: y}]}]}>
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} activeOpacity={1} onPress={() => {}}>
        <ItemDetailTransportationInfo i={props.item} onDelete={deleteItem} />
      </TouchableOpacity>
    </Animated.View>
  )
}

export default ItemRenderHeader

const styles = StyleSheet.create({
  header: {
    width: '100%',
    position: 'absolute',
  },
})
