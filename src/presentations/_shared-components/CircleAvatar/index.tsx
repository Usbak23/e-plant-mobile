import React from 'react'
import {Image, StyleSheet} from 'react-native'

interface IProps {
  imageUrl?: string | null
}

const CircleAvatar: React.FC<IProps> = (props: IProps) => {
  const defaultUrl = 'https://www.logolynx.com/images/logolynx/4b/4beebce89d681837ba2f4105ce43afac.png'
  const construct = (url: string) => {
    return `data:image/png;base64,${url}`
  }
  const url = props?.imageUrl ? construct(props.imageUrl) : defaultUrl
  return <Image style={styles.image} resizeMode="cover" source={{uri: url}} />
}

export default CircleAvatar

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
})
