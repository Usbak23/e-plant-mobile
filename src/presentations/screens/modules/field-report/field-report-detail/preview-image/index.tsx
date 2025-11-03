import {theme} from '@app/presentations/utils/styles'
import {useNavigation, useRoute} from '@react-navigation/native'
import React, {createRef, useRef, useState} from 'react'
import {Animated, Dimensions, TouchableOpacity, View} from 'react-native'
import {PanGestureHandler, PinchGestureHandler, State} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const screen = Dimensions.get('window')
const PreviewImageFieldReport = () => {
  const navigation = useNavigation()
  const route: any = useRoute()
  const imageUri = route?.params?.imageUri
  const [panEnabled, setPanEnabled] = useState(false)
  const scale = useRef(new Animated.Value(1)).current
  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current

  const pinchRef = createRef()
  const panRef = createRef()

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {scale},
      },
    ],
    {useNativeDriver: true},
  )

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  )

  const handlePinchStateChange = ({nativeEvent}) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true)
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start()
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start()

        setPanEnabled(false)
      }
    }
  }

  return (
    <View style={{backgroundColor: theme.colors.black}}>
      <PanGestureHandler
        onGestureEvent={onPanEvent}
        ref={panRef}
        simultaneousHandlers={[pinchRef]}
        enabled={panEnabled}
        failOffsetX={[-1000, 1000]}
        shouldCancelWhenOutside>
        <Animated.View>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchEvent}
            simultaneousHandlers={[panRef]}
            onHandlerStateChange={handlePinchStateChange}>
            <Animated.Image
              source={{
                uri: imageUri,
              }}
              style={{
                width: '100%',
                height: '100%',
                transform: [{scale}, {translateX}, {translateY}],
              }}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      <View
        style={{
          flex: 1,
          margin: 8,
          top: 0,
          alignSelf: 'flex-start',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <View
            style={{
              borderRadius: 5,
              backgroundColor: '#F1F3F6',
              height: 40,
              width: 40,
              marginLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="arrow-left" size={14} color={theme.colors.textThinBlack} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PreviewImageFieldReport
