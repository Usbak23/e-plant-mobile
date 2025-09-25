import React, {useRef} from 'react'
import {Animated, PanResponder} from 'react-native'

interface IHeaderPanResponder {
  headerScrollY: any
  syncScrollOffset: any
  scrollY: any
  listRefArr: any
  routes: any[]
  _tabIndex: any
  headerScrollStart: any
}

export const useHeaderPanResponder = (props: IHeaderPanResponder) =>
  useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        props.headerScrollY.stopAnimation()
        props.syncScrollOffset()
        return false
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        props.headerScrollY.stopAnimation()
        return Math.abs(gestureState.dy) > 5
      },

      onPanResponderRelease: (evt, gestureState) => {
        props.syncScrollOffset()
        if (Math.abs(gestureState.vy) < 0.2) {
          return
        }
        props.headerScrollY.setValue(props.scrollY._value)
        Animated.decay(props.headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          props.syncScrollOffset()
        })
      },
      onPanResponderMove: (evt, gestureState) => {
        props.listRefArr.current.forEach((item: any) => {
          if (item.key !== props.routes[props._tabIndex.current].key) {
            return
          }
          if (item.value) {
            item.value.scrollToOffset({
              offset: -gestureState.dy + props.headerScrollStart.current,
              animated: false,
            })
          }
        })
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        props.headerScrollStart.current = props.scrollY._value
      },
    }),
  ).current
