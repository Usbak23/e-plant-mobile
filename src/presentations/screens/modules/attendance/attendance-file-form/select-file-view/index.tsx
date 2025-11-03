import { theme } from '@app/presentations/utils/styles'
import { Button, Text } from '@app/presentations/_shared-components'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import FeatherFolder from '@assets/icons/feather/feather_folder.svg'
import downloadFile from '@app/presentations/utils/downloadFile'
import System from '@app/domain/services/System'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'
import { showSuccessToast } from '@app/presentations/_shared-components/Toast'

interface Props {
  onChooseFile?: () => void
}

const SelectAttendanceFile = ({ onChooseFile }: Props) => {
  return (
    <View>
      <Text type="semibold" size={13} color={theme.colors.textThinBlack}>
        Unggah File absensi<Text color={theme.colors.redDark}>*</Text>
      </Text>

      <Text style={{ marginTop: 4 }} size={12} color={theme.colors.textThinBlack}>
        File yang ingin diupload harus sama dengan template yang sudah kami sediakan.
        Jika belum punya template silahkan download terlebih dahulu atau jika sudah punya bisa langsung upload filenya.
        Unggahan file maksimum adalah 5 mb dan hanya format file .xls yang didukung. <Text onPress={async () => {
          const fileName = `Template Absensi.xls`
          const res = await downloadFile(System.instance.attendanceService.downloadTemplateAbsensi(), fileName)
          notifications
            .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Template absensi berhasil diunduh. Cek ' + res, c.EXPORT_NOTIFICATION_ID, {
              path: res,
            })
            .then(res => { })
            .catch(e => { })
          showSuccessToast('Template berhasil didiownload di' + res)
        }} size={12} type='semibold' color={theme.colors.accent}>Download template disini</Text>
      </Text>

      <View style={styles.container}>
        <Text color={theme.colors.yellowDark} type="semibold">
          Unggah File Absensi
        </Text>
        <Text color={theme.colors.yellowDark} size={11} style={styles.textDesc}>
          Ukuran file tidak boleh lebih dari 5MB
        </Text>

        <FeatherFolder width={48} height={48} />

        <Button
          style={{ paddingHorizontal: 16, paddingVertical: 6, backgroundColor: theme.colors.yellowDark, marginTop: 16 }}
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

export default SelectAttendanceFile

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
