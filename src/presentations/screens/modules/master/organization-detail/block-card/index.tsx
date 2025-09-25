import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Entypo from 'react-native-vector-icons/Entypo'

interface IBlockCardProps {
  block: any
}

const BlockCard: React.FC<IBlockCardProps> = props => {
  const {name, coordinate, tph, varietas, kapel_panen, total_of_line} = props.block
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text color={theme.colors.accent} type="semibold">
            {name}
          </Text>
          <TouchableOpacity style={{padding: 13, margin: -13}} onPress={() => {}}>
            <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
          <View>
            <View style={{flex: 1}}>
              <Text color={theme.colors.label} size={11}>
                Koordinat
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {coordinate}
              </Text>
            </View>
            <View style={styles.topSpacer}>
              <Text color={theme.colors.label} size={11}>
                Kapel Panen
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {kapel_panen}
              </Text>
            </View>
          </View>

          <View>
            <View style={{flex: 1}}>
              <Text color={theme.colors.label} size={11}>
                Jumlah Baris
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {total_of_line}
              </Text>
            </View>

            <View style={styles.topSpacer}>
              <Text color={theme.colors.label} size={11}>
                Jumlah TPH
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {tph}
              </Text>
            </View>
          </View>

          <View>
            <View style={{flex: 1}}>
              <Text color={theme.colors.label} size={11}>
                Varietas
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {varietas}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default BlockCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 22,
    marginVertical: 7.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  topSpacer: {
    marginTop: 16,
  },
})
