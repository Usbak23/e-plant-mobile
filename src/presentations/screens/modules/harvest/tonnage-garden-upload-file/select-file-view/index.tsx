import {theme} from '@app/presentations/utils/styles'
import {Button, Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import FeatherFolder from '@assets/icons/feather/feather_folder.svg'

interface Props {
  onChooseFile?: () => void
}

const SelectTonnageGardenFile = ({onChooseFile}: Props) => {
  return (
    <View>
      <Text type="semibold" size={13} color={theme.colors.textThinBlack}>
        Unggah File Tonase Kebun<Text color={theme.colors.redDark}>*</Text>
      </Text>

      <View style={styles.container}>
        <Text color={theme.colors.yellowDark} type="semibold">
          Unggah File Tonase Kebun
        </Text>
        <Text color={theme.colors.yellowDark} size={11} style={styles.textDesc}>
          Ukuran file tidak boleh lebih dari 5MB
        </Text>

        <FeatherFolder width={48} height={48} />

        <Button
          style={{paddingHorizontal: 16, paddingVertical: 6, backgroundColor: theme.colors.yellowDark, marginTop: 16}}
          onPress={() => {
            onChooseFile && onChooseFile()
          }}>
          <Text size={12} color={theme.colors.pureWhite} type="bold">
            Pilih File
          </Text>
        </Button>
      </View>
    </View>
  )
}

export default SelectTonnageGardenFile

const styles = StyleSheet.create({
  root: {
    margin: 16,
  },
  container: {
    marginTop: 16,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.yellowSemiTransparent,
  },
  textDesc: {
    marginTop: 8,
    marginBottom: 16,
  },
})
