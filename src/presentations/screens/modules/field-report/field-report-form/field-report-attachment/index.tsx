import {theme} from '@app/presentations/utils/styles'
import {Button, Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import IconFolder from '@assets/icons/ic_folder.svg'

interface IProps {
  onChooseFile?: Function
  title?: string
  disabled?: boolean
}

const FieldReportAttachment = ({onChooseFile = () => {}, title, disabled}: IProps) => {
  return (
    <View style={styles.root}>
      <Text type="semibold" color={theme.colors.yellowDark}>
        {disabled ? 'File sudah mencapai jumlah maksimum (10)' : 'Unggah Lampiran Dokumen'}
      </Text>
      {disabled ? null : (
        <Text style={{textAlign: 'center', marginVertical: 8}} size={12} color={theme.colors.yellowDark}>
          Ukuran dokumen maksimal 2MB per dokumen
        </Text>
      )}

      <IconFolder width={32} height={32} color={theme.colors.yellowDark} />
      {disabled ? null : (
        <Button style={styles.button} onPress={async () => await onChooseFile()}>
          <Text size={11} color={theme.colors.white} type="semibold">
            {title || 'Pilih File'}
          </Text>
        </Button>
      )}
    </View>
  )
}

export default FieldReportAttachment

const styles = StyleSheet.create({
  root: {
    marginVertical: 16,
    borderWidth: 1,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderColor: theme.colors.yellowDark,
    padding: 36,
    backgroundColor: theme.colors.yellowSemiTransparent,
    alignItems: 'center',
  },
  button: {
    height: 40,
    backgroundColor: theme.colors.yellowDark,
  },
})
