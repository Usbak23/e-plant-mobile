import React, {forwardRef} from 'react'
import {Animated, PanResponder} from 'react-native'

interface Props {
  routes: any[]
  listRefArr: any
  scrollY: any
  HeaderHeight: number
  listOffset: any
  _tabIndex: any
}

const syncOffset = (props: Props) => {
  const {routes, listRefArr, scrollY, HeaderHeight, listOffset, _tabIndex} = props
  const curRouteKey = routes[_tabIndex.current].key

  listRefArr.current.forEach((item: any) => {
    if (item.key !== curRouteKey) {
      if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
        if (item.value) {
          item.value.scrollToOffset({
            offset: scrollY._value,
            animated: false,
          })
          listOffset.current[item.key] = scrollY._value
        }
      } else if (scrollY._value >= HeaderHeight) {
        if (listOffset.current[item.key] < HeaderHeight || listOffset.current[item.key] == null) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: HeaderHeight,
              animated: false,
            })
            listOffset.current[item.key] = HeaderHeight
          }
        }
      }
    }
  })
}
export default syncOffset
