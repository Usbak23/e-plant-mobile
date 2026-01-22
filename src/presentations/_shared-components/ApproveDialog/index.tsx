import React, { useState } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native'
import Text from '@app/presentations/_shared-components/Text'
import { theme } from '@app/presentations/utils/styles'

interface ApproveDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: (notes?: string) => void
  loading?: boolean
  rktData?: {
    subActivity: string
    organization: string
    division: string
  }
}

const ApproveDialog: React.FC<ApproveDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
  rktData
}) => {
  const [notes, setNotes] = useState('')

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined)
    setNotes('')
  }

  const handleClose = () => {
    setNotes('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text size={18} type="semibold" style={styles.title}>
            Konfirmasi Persetujuan
          </Text>
          
          {rktData && (
            <View style={styles.rktInfo}>
              <Text size={14} color={theme.colors.grey}>Sub Aktivitas: {rktData.subActivity}</Text>
              <Text size={14} color={theme.colors.grey}>Organisasi: {rktData.organization}</Text>
              <Text size={14} color={theme.colors.grey}>Divisi: {rktData.division}</Text>
            </View>
          )}
          
          <Text size={14} style={styles.message}>
            Apakah Anda yakin ingin menyetujui RKT ini?
          </Text>
          
          <TextInput
            placeholder="Catatan (opsional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text size={14} type="semibold">Batal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.confirmButton, loading && styles.disabledButton]} 
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text size={14} type="semibold" color={theme.colors.white}>
                {loading ? 'Loading...' : 'Setujui'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  rktInfo: {
    backgroundColor: theme.colors.lightGrey,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
  },
  notesInput: {
    marginBottom: 20,
    minHeight: 80,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#66BB6A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
})

export default ApproveDialog