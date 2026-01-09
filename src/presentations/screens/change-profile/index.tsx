import React, {useEffect} from 'react'
import {Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {Header, Loader, MoreButton, Text} from '@app/presentations/_shared-components'
import Entypo from 'react-native-vector-icons/Entypo'
import {useNavigation} from '@react-navigation/native'
import { pick, types } from '@react-native-documents/picker'
import Routes from '@app/presentations/navigation/Routes'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'

const ChangeProfile = () => {
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const user = useSelector((state: RootStateType) => state.user?.currentUserInfo)
  const uploadProfilePictureForm = useSelector((state: RootStateType) => state.user?.userProfilePictureForm)

  const constructInitial = () => {
    const splitted = user?.data?.name ? user?.data?.name.split(' ') : []
    if (splitted && splitted.length > 0) {
      if (splitted.length > 1) {
        return `${splitted[0][0] || ''}${splitted[1][0] || ''}`.toUpperCase()
      }
      return `${splitted[0][0] || ''}`.toUpperCase()
    }
    return ''
  }

  const chooseFile = async () => {
    try {
      const res = await pick({
        type: [types.images],
        allowMultiSelection: false,
      })

      if ( res[0].size && res[0].size > 1000000) {
        showErrorToast('Size file melebihi batas (1MB)')
        return
      }

      doUpload(res[0])
    } catch (err: any) {
      throw err
      // if (DocumentPicker.isCancel(err)) {
      // } else {
      // }
    }
  }

  const doUpload = (file: any) => {
    dispatch(actions.uploadProfilePicture.request({loading: true, data: file}))
  }

  useEffect(() => {
    const error = uploadProfilePictureForm?.error
    if (error) {
      const msg = 'Gagal saat memperbarui foto profil'
      showErrorToast(msg)
    }
  }, [uploadProfilePictureForm?.error])

  useEffect(() => {
    const data = uploadProfilePictureForm?.data
    if (data?.status == 'success') {
      showSuccessToast('Foto profil berhasil disimpan')
    }
  }, [uploadProfilePictureForm?.data])

  const IconChangeImage = () => (
    <TouchableOpacity onPress={chooseFile}>
      <Entypo
        style={{alignSelf: 'center', backgroundColor: theme.colors.backgroundDark, padding: 12, borderRadius: 30}}
        name="camera"
        size={18}
        color={theme.colors.white}
      />
    </TouchableOpacity>
  )
  const InitialProfileView = () => (
    <View style={{width: 118, height: 118, alignSelf: 'center'}}>
      <View style={{alignItems: 'center', margin: 16}}>
        <View style={styles.profilePicView}>
          <Text size={20} color={theme.colors.accent} type="semibold">
            {constructInitial()}
          </Text>
        </View>
      </View>
      <View style={{position: 'absolute', bottom: 0, right: 0}}>
        <IconChangeImage />
      </View>
    </View>
  )

  const ImageView = () => (
    <View style={{width: 118, height: 118, alignSelf: 'center'}}>
      <View style={{alignItems: 'center', margin: 16}}>
        <Image
          style={styles.image}
          source={{uri: user?.data?.imageProfile ? `data:image/png;base64,${user?.data?.imageProfile}` : ''}}
          resizeMode={'cover'}
        />
      </View>
      <View style={{position: 'absolute', bottom: 0, right: 0}}>
        <IconChangeImage />
      </View>
    </View>
  )

  const ProfilePicView = () => {
    return user?.data?.imageProfile ? <ImageView /> : <InitialProfileView />
  }
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Ubah Profile" />
      <ScrollView style={styles.body}>
        <ProfilePicView />
        <MoreButton
          label="Ubah Kata Sandi"
          onTap={() => {
            navigation.navigate(Routes.CHANGE_PROFILE_PASSWORD)
          }}
        />
        {user?.data?.email != null && user?.data?.email != '' && user?.data?.isEmailConfirm ? null : (
          <MoreButton
            label="Tambah Email"
            onTap={() => {
              navigation.navigate(Routes.ADD_CHANGE_EMAIL)
            }}
          />
        )}
      </ScrollView>
      <Loader loading={Boolean(uploadProfilePictureForm?.loading)} />
    </SafeAreaView>
  )
}

export default ChangeProfile

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.pureWhite,
  },
  body: {
    padding: 16,
  },
  profilePicView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(240, 177, 13, 0.3);',
    height: 96,
    width: 96,
    borderRadius: 48,
    padding: 16,
  },
  image: {
    width: 96,
    height: 96,
    borderColor: theme.colors.textThinBlack,
    borderWidth: 2,
    borderRadius: 48,
  },
})
