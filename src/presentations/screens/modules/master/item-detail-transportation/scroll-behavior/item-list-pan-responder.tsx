import React, {useRef} from 'react'
import {PanResponder} from 'react-native'

interface IListPanResponder {
  headerScrollY: any
}

export const useItemListPanResponder = (props: IListPanResponder) =>
  useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        props.headerScrollY.stopAnimation()
        return false
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        props.headerScrollY.stopAnimation()
      },
    }),
  )
