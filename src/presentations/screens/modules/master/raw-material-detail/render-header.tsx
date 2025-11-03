import {IRawMaterialDetail} from '@app/models/eplant/RawMaterial'
import {Header} from '@app/presentations/_shared-components'
import React from 'react'
import {Animated, StyleSheet, TouchableOpacity} from 'react-native'
import RawMaterialDetailInfo from './raw-material-detail-info'

interface IRenderHeaderProps {
  scrollY: any
  HeaderHeight: any
  rawMaterial?: IRawMaterialDetail | undefined | null
  headerPanResponder: any
  isAllowedToOrganizePurchasement?: boolean
}
const RenderHeader: React.FC<IRenderHeaderProps> = props => {
  const {scrollY, HeaderHeight, rawMaterial, headerPanResponder} = props
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
        {/* <Header title="Detail Material" /> */}
        <RawMaterialDetailInfo
          isAllowedToOrganizePurchasement={props.isAllowedToOrganizePurchasement}
          rawMaterial={rawMaterial}
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

export default RenderHeader

const styles = StyleSheet.create({
  header: {
    width: '100%',
    position: 'absolute',
  },
})
