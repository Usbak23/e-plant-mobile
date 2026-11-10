import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {SafeAreaView} from 'react-native-safe-area-context'
import {Image, ScrollView, StatusBar, StyleSheet, View, ActivityIndicator} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {ModalAsk, MoreButton, Text} from '@app/presentations/_shared-components'
import Entypo from 'react-native-vector-icons/Entypo'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import {actions, RootStateType} from '@app/domain/states/store'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import {Platform} from 'react-native'
import {showInfoToast, showSuccessToast, showErrorToast} from '@app/presentations/_shared-components/Toast'
import {writeFile} from '@app/presentations/utils/writeFile'
import {constructHtmlBodyToPdf} from '@app/presentations/utils/html/userDataHtml'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'
import {useNetInfo} from '@react-native-community/netinfo'

const ProfilePage = () => {
  const isFocused = useIsFocused()
  const navigation: any = useNavigation()
  const user = useCurrentUserInfo()
  const dispatch = useDispatch()
  const netInfo = useNetInfo()

  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  
  const syncStatus = useSelector((state: RootStateType) => state.user?.syncMasterDataStatus)
  const isSyncing = syncStatus?.loading === true
  const isOnline = netInfo.isConnected && netInfo.isInternetReachable !== false

  const logout = () => {
    dispatch(actions.clearRkhTakeCareDraft.request({loading: true, data: []}))
    dispatch(actions.clearRkhDraft.request({loading: true, data: []}))
    dispatch(actions.clearBpbksDraft.request({loading: true, data: []}))
    dispatch(actions.clearBkmTakeCareDraft.request({loading: true, data: []}))
    dispatch(actions.clearBkmDraft.request({loading: true, data: []}))
    dispatch(actions.clearAttendanceDraft.request({loading: true, data: []}))
    dispatch(actions.clearAkpDraft.request({loading: true, data: []}))
    dispatch(actions.logout.request({loading: true}))
    dispatch(actions.logout.success({loading: false, data: undefined}))
  }

  const constructInitial = () => {
    const splitted = user?.name ? user.name.split(' ') : []
    if (splitted && splitted.length > 0) {
      if (splitted.length > 1) {
        return `${splitted[0][0] || ''}${splitted[1][0] || ''}`.toUpperCase()
      }
      return `${splitted[0][0]}`.toUpperCase()
    }
    return ''
  }

  const createPDF = async () => {
    const html = constructHtmlBodyToPdf(user)
    if (Platform.OS == 'ios') {
      const options = {
        html: html,
        fileName: 'user',
        base64: true,
        directory: 'Documents',
      }

      await RNHTMLtoPDF.convert(options)
      showInfoToast('Data telah disimpan. Periksa folder dokumen anda')
    } else {
      const options = {
        html: html,
        fileName: 'test',
        directory: 'Documents',
        base64: true,
      }

      const file = await RNHTMLtoPDF.convert(options)
      const res = await writeFile(file.base64, '_user.pdf', 'base64')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Cetak pdf berhasil', c.EXPORT_NOTIFICATION_ID, {
          path: res,
        })
        .then(res => {})
        .catch(e => {
          console.log('e', e)
        })
      showSuccessToast('Data telah disimpan. Periksa ' + res)
    }
  }

  const generalInformations = [
    {
      label: 'NIP',
      value: user?.nip || '-',
    },
    {
      label: 'Alamat',
      value: user?.address || '-',
    },
    {
      label: 'No. Telepon',
      value: user?.phoneNumber || '-',
    },
    {
      label: 'Jenis Kelamin',
      value: user?.gender ? (user?.gender == 'L' ? 'Laki-laki' : 'Perempuan') : '-',
    },
    {
      label: 'Jenis Karyawan',
      value: user?.typeEmployee?.name || '-',
    },
    {
      label: 'Email',
      value: user?.email || '-',
    },
  ]

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getCurrentUser.request({loading: true}))
    }
  }, [isFocused])

  useEffect(() => {
    if (syncStatus?.loading === false && syncStatus?.data) {
      showSuccessToast(`Data berhasil disinkronkan (${syncStatus.data.synced} item)`)
    } else if (syncStatus?.error) {
      showErrorToast('Gagal sinkronisasi data')
    }
  }, [syncStatus])

  const handleSyncData = () => {
    if (!isOnline) {
      showErrorToast('Tidak bisa sync data saat offline')
      return
    }
    dispatch(actions.syncMasterData.request({loading: true}))
  }

  const HeaderLeft = () => <Image source={require('@assets/icons/sag.png')} style={styles.arvisLogoImg} />
  const HeaderRight = () => (
    <Menu>
      <MenuTrigger>
        <View style={{padding: 10}}>
          <Entypo name="dots-three-vertical" size={15} color={theme.colors.white} />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            padding: 8,
            borderRadius: 10,
          },
        }}>
        <MenuOption
          onSelect={() => {
            navigation.navigate(Routes.CHANGE_PROFILE)
          }}>
          <PopupEditDelete iconName="create" text="Ubah Profile" />
        </MenuOption>
        <MenuOption
          value={1}
          onSelect={async () => {
            await createPDF()
          }}>
          <PopupEditDelete iconName="file-upload" text="Cetak Data" />
        </MenuOption>
      </MenuOptions>
    </Menu>
  )

  const UserInfo = () => (
    <>
      <Text type="semibold" style={{marginTop: 16}} color={theme.colors.white}>
        {user?.name || ''}
      </Text>
      <Text style={{marginTop: 8}} size={12} color={theme.colors.white}>
        {user?.role?.name || ''}
      </Text>
    </>
  )

  const InitialProfileView = () => (
    <View style={{alignItems: 'center'}}>
      <View style={styles.profilePicView}>
        <Text size={18} color={theme.colors.white} type="semibold">
          {constructInitial()}
        </Text>
      </View>
      <UserInfo />
    </View>
  )

  const ImageView = () => (
    <View style={{alignItems: 'center'}}>
      <Image
        style={styles.image}
        source={{uri: user?.imageProfile ? `data:image/png;base64,${user?.imageProfile}` : ''}}
        resizeMode={'cover'}
      />
      <UserInfo />
    </View>
  )

  const ProfilePicView = () => {
    return user?.imageProfile ? <ImageView /> : <InitialProfileView />
  }

  const ModalLogout = () => (
    <ModalAsk
      isDanger={true}
      isOpen={isModalOpen}
      title="Keluar?"
      onTouchOutside={() => setModalOpen(false)}
      description={
        'Apakah anda yakin ingin keluar dari aplikasi? Data offline juga akan ikut terhapus jika anda logout'
      }
      positiveButtonText={'Keluar'}
      onPositiveButtonTap={() => {
        logout()

        setModalOpen(false)
      }}
    />
  )

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.backgroundDark}}>
      <ScrollView style={{backgroundColor: 'white', paddingBottom: 28}} showsVerticalScrollIndicator={false}>
        <StatusBar animated={true} backgroundColor={theme.colors.backgroundDark} barStyle="light-content" />
        <View style={styles.headerBg}>
          <View style={styles.headerView}>
            <HeaderLeft />
            <HeaderRight />
          </View>
          <ProfilePicView />
        </View>

        <View style={{padding: 16}}>
          <Text style={{marginVertical: 16}} type="semibold">
            Informasi Umum
          </Text>

          {generalInformations.map((item: {label: string; value: string}, idx: number) => (
            <View key={idx} style={{marginBottom: 10}}>
              <LabelValue label={item.label} value={item.value} />
              {item.label == 'Email' && !user?.isEmailConfirm && user?.email != '' && (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Entypo name="info-with-circle" size={10} color={theme.colors.redDark} />
                  <Text size={10} style={{marginStart: 8}} color={theme.colors.redDark}>
                    Email belum diverifikasi
                  </Text>
                </View>
              )}
            </View>
          ))}

          <View style={{marginTop: 8}} />

          <View>
            <MoreButton
              label="Perbarui Data"
              iconName={isSyncing ? undefined : 'cycle'}
              customIcon={isSyncing ? <ActivityIndicator size="small" color={theme.colors.accent} /> : undefined}
              onTap={handleSyncData}
              disabled={isSyncing || !isOnline}
            />
            {!isOnline && (
              <View style={{marginTop: -8, marginBottom: 8, marginLeft: 16}}>
                <Text size={11} color={theme.colors.label}>
                  Perbarui data untuk mode offline (hanya saat online)
                </Text>
              </View>
            )}
            {isOnline && !isSyncing && (
              <View style={{marginTop: -8, marginBottom: 8, marginLeft: 16}}>
                <Text size={11} color={theme.colors.label}>
                  Perbarui data untuk mode offline
                </Text>
              </View>
            )}
          </View>

          <MoreButton
            label="Penanggung Jawab"
            onTap={() => {
              navigation.navigate(Routes.APPROVER)
            }}
          />
          <MoreButton
            label="Lingkup Kerja"
            onTap={() => {
              navigation.navigate(Routes.WORKING_AREA)
            }}
          />
          <MoreButton hideIcon label="Keluar" onTap={() => setModalOpen(true)} />
        </View>
      </ScrollView>
      <ModalLogout />
    </SafeAreaView>
  )
}

const LabelValue = (item: {label: string; value: string}) => (
  <View style={{flex: 1}}>
    <View style={{flex: 1}}>
      <Text type="semibold" style={{paddingVertical: 2}}>
        {item.label}
      </Text>
    </View>
    <View style={{flex: 1, marginVertical: 4}}>
      <Text>{item.value}</Text>
    </View>

    <View style={{flex: 1, height: 1, marginVertical: 8, backgroundColor: theme.colors.separator}} />
  </View>
)

export default ProfilePage

const styles = StyleSheet.create({
  headerBg: {
    width: '100%',
    // position: 'absolute',
    minHeight: 200,
   borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: theme.colors.backgroundDark,
    padding: 26,
  },
  headerView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arvisLogoImg: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  profilePicView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    height: 64,
    width: 64,
    borderRadius: 48,
    padding: 16,
  },
  image: {
    width: 64,
    height: 64,
    borderColor: theme.colors.textThinBlack,
    borderWidth: 2,
    borderRadius: 32,
  },
})
