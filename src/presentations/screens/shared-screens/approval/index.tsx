import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList, TextInput, RefreshControl, Modal, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Text, Loader } from '@app/presentations/_shared-components'
import { theme } from '@app/presentations/utils/styles'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import Feather from 'react-native-vector-icons/Feather'

interface ApprovalItem {
  id: string
  year: number
  physicalPlanVolume?: number
  organization: {
    id: string
    name: string
  }
  division?: {
    id: string
    name: string
  }
  subActivity: {
    id: string
    name: string
  }
  user?: {
    name: string
    nip: string
    role?: {
      name: string
    }
  }
  status: string
  currentApprovalLevel: number
  createdAt: string
}

const ApprovalCard = ({ item, onApprove, onReject }: { item: ApprovalItem, onApprove: () => void, onReject: () => void }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.accent} type="semibold">
              {item.subActivity.name}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label || '-'} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item.organization.name || '-'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item.division?.name || '-'}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Volume Fisik
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item.physicalPlanVolume?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Tanggal
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {new Date(item.createdAt).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Pembuat
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item.user ? `${item.user.name} (${item.user.nip})` : '-'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Role
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item.user?.role?.name || '-'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={onApprove}>
          <Text size={14} type="semibold" color={theme.colors.white}>Setuju</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text size={14} type="semibold" color={theme.colors.white}>Tolak</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const ApprovalScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const approval = useSelector((state: RootStateType) => state.approval)
  const [searchText, setSearchText] = useState('')
  const [filteredApprovals, setFilteredApprovals] = useState<ApprovalItem[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)
  const [rejectNotes, setRejectNotes] = useState('')
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  useEffect(() => {
    if (approval?.pendingApprovals?.data) {
      console.log('Approval data received:', approval.pendingApprovals.data)
      const newData = approval.pendingApprovals.data
      
      if (page === 1) {
        setFilteredApprovals(newData)
      } else {
        setFilteredApprovals(prev => [...prev, ...newData])
      }
      
      if (newData.length < 10) {
        setHasMore(false)
      }
      
      setLoadingMore(false)
      filterApprovals(searchText)
    }
  }, [approval?.pendingApprovals?.data, page])

  useEffect(() => {
    if (approval?.approve?.data) {
      showSuccessToast('RKT berhasil disetujui')
      dispatch(actions.approval.clearApprovalStatus())
      fetchPendingApprovals()
    }
  }, [approval?.approve?.data])

  useEffect(() => {
    if (approval?.reject?.data) {
      showSuccessToast('RKT berhasil ditolak')
      dispatch(actions.approval.clearApprovalStatus())
      fetchPendingApprovals()
    }
  }, [approval?.reject?.data])

  useEffect(() => {
    if (approval?.approve?.error) {
      showErrorToast('Gagal menyetujui RKT')
    }
    if (approval?.reject?.error) {
      showErrorToast('Gagal menolak RKT')
    }
    if (approval?.pendingApprovals?.error) {
      console.error('Error fetching approvals:', approval.pendingApprovals.error)
      showErrorToast('Gagal memuat data persetujuan')
    }
  }, [approval?.approve?.error, approval?.reject?.error, approval?.pendingApprovals?.error])

  // Safety check for approval state
  if (!approval) {
    console.error('Approval state is undefined')
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Persetujuan RKT" />
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const fetchPendingApprovals = (pageNum = 1, isLoadMore = false) => {
    try {
      console.log('Fetching pending approvals...', { page: pageNum, isLoadMore })
      if (!isLoadMore) {
        setPage(1)
        setHasMore(true)
      }
      dispatch(actions.approval.getPendingApprovals.request({ 
        loading: !isLoadMore,
        page: pageNum,
        limit: 10
      }))
    } catch (error) {
      console.error('Error in fetchPendingApprovals:', error)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    setPage(1)
    setHasMore(true)
    dispatch(actions.approval.getPendingApprovals.request({ 
      loading: false,
      page: 1,
      limit: 10
    }))
    setTimeout(() => setRefreshing(false), 1000)
  }

  const loadMore = () => {
    if (!loadingMore && hasMore && filteredApprovals.length > 0) {
      setLoadingMore(true)
      const nextPage = page + 1
      setPage(nextPage)
      fetchPendingApprovals(nextPage, true)
    }
  }

  const renderFooter = () => {
    if (!loadingMore) return null
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text size={12} color={theme.colors.grey}>Loading more...</Text>
      </View>
    )
  }

  const filterApprovals = (text: string) => {
    const approvals = approval?.pendingApprovals?.data || []
    if (!text.trim()) {
      setFilteredApprovals(approvals)
    } else {
      const filtered = approvals.filter(item => 
        item.subActivity.name.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredApprovals(filtered)
    }
  }

  const handleApprove = (item: ApprovalItem) => {
    Alert.alert(
      'Konfirmasi Persetujuan',
      `Apakah Anda yakin ingin menyetujui RKT ${item.subActivity.name}?`,
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Setujui',
          onPress: () => {
            dispatch(actions.approval.approveRkt.request({
              loading: true,
              data: { id: item.id, notes: 'Disetujui dari mobile' }
            }))
          }
        }
      ]
    )
  }

  const handleReject = (item: ApprovalItem) => {
    setSelectedItem(item)
    setRejectNotes('')
    setRejectModalVisible(true)
  }

  const confirmReject = () => {
    if (!rejectNotes.trim()) {
      Alert.alert('Error', 'Alasan penolakan wajib diisi')
      return
    }
    if (selectedItem) {
      dispatch(actions.approval.rejectRkt.request({
        loading: true,
        data: { id: selectedItem.id, notes: rejectNotes.trim() }
      }))
      setRejectModalVisible(false)
      setSelectedItem(null)
      setRejectNotes('')
    }
  }

  const cancelReject = () => {
    setRejectModalVisible(false)
    setSelectedItem(null)
    setRejectNotes('')
  }

  const renderApprovalItem = ({ item }: { item: ApprovalItem }) => {
    try {
      return (
        <ApprovalCard
          item={item}
          onApprove={() => handleApprove(item)}
          onReject={() => handleReject(item)}
        />
      )
    } catch (error) {
      console.error('Error rendering approval item:', error)
      return (
        <View style={styles.card}>
          <Text>Error rendering item</Text>
        </View>
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Persetujuan RKT" />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={theme.colors.grey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari berdasarkan sub aktivitas..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.section}>
          <Text size={16} type="bold" style={styles.title}>
            Daftar Persetujuan RKT
          </Text>
          {approval?.pendingApprovals?.error && (
            <Text size={12} color={theme.colors.red}>
              Error: {approval.pendingApprovals.error.message || 'Unknown error'}
            </Text>
          )}
        </View>

        <FlatList
          data={filteredApprovals}
          renderItem={renderApprovalItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={{padding: 20, alignItems: 'center'}}>
              <Text>Tidak ada data persetujuan</Text>
            </View>
          }
        />
      </View>
      
      <Loader loading={approval?.pendingApprovals?.loading || approval?.approve?.loading || approval?.reject?.loading} />
      
      <Modal
        visible={rejectModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelReject}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text size={16} type="semibold" style={styles.modalTitle}>
              Konfirmasi Penolakan
            </Text>
            <Text size={14} style={styles.modalSubtitle}>
              Berikan alasan penolakan untuk RKT {selectedItem?.subActivity.name}:
            </Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Masukkan alasan penolakan..."
              value={rejectNotes}
              onChangeText={setRejectNotes}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={cancelReject}>
                <Text size={14} type="semibold" color="#333">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmReject}>
                <Text size={14} type="semibold" color={theme.colors.white}>Tolak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -5,
    marginTop: 20,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#66BB6A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF5350',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.grey,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 80,
    fontSize: 14,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#EF5350',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
})

export default ApprovalScreen