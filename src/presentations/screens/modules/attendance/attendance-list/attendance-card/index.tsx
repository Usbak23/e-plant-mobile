import {Division} from '@app/models/eplant/Division'
import {IOrganizationRowAll} from '@app/models/eplant/Organization'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'

interface Props {
  isDraft?: boolean
  attendanceData?: {
    organization: IOrganizationRowAll
    dateAttendance: string
  }
  item: Division
}

const AttendanceCard = ({isDraft, attendanceData, item}: Props) => {
  const navigation: any = useNavigation()

  const SeeDetailButton = () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.ATTENDANCE_DETAIL, {attendanceData, division: item})
      }}>
      <View style={isDraft ? styles.attendanceButtonRed : styles.attendanceButton}>
        <Text color={isDraft ? theme.colors.redDark : theme.colors.accent} type="semibold" size={11}>
          Lihat Absensi
        </Text>
      </View>
    </TouchableOpacity>
  )

  const cardStyle = () => {
    return isDraft
      ? {
          backgroundColor: theme.colors.redSemiTransparent,
          shadowColor: theme.colors.pureWhite,
        }
      : {
          backgroundColor: theme.colors.pureWhite,
          shadowColor: theme.colors.black,
        }
  }
  return (
    <View style={[styles.card, cardStyle()]}>
      <View>
        {isDraft && (
          <Text color={theme.colors.redDark} size={12}>
            Absen masih dalam bentuk draft
          </Text>
        )}

        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.black} type="semibold">
              {item?.name || '-'}
            </Text>
          </View>

          <View>{SeeDetailButton()}</View>
        </View>
      </View>
    </View>
  )
}

export default AttendanceCard

const styles = StyleSheet.create({
  card: {
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
  attendanceButton: {
    backgroundColor: 'rgba(240, 177, 13, 0.15);',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },

  attendanceButtonRed: {
    backgroundColor: theme.colors.redSemiTransparent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },

  header: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
