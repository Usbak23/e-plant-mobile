import {useNavigation} from '@react-navigation/core'
import React from 'react'
import {Animated, GestureResponderHandlers, StyleSheet, View} from 'react-native'
import {PanGestureHandler} from 'react-native-gesture-handler'

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
}

const ContentTabWrapper: React.FC<IContentTabProps> = props => {
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
  } = props

  return (
    <Animated.FlatList
      // scrollEnabled={canScroll}
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
      ListHeaderComponent={() => <View style={{height: 10}} />}
      contentContainerStyle={{
        paddingTop: HeaderHeight + TabBarHeight,
        paddingHorizontal: 10,
        minHeight: windowHeight + HeaderHeight,
        // minHeight: windowHeight - SafeStatusBar + HeaderHeight,
      }}
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

export default ContentTabWrapper

const styles = StyleSheet.create({})
