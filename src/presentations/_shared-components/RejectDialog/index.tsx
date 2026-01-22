import React, { useState } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native'
import Text from '@app/presentations/_shared-components/Text'
import { theme } from '@app/presentations/utils/styles'

interface RejectDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: (notes: string) => void
  loading?: boolean
  rktData?: {
    subActivity: string
    organization: string
    division: string
  }
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
  rktData
}) => {
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (!notes.trim()) {
      setError('Alasan penolakan wajib diisi')
      return
    }
    if (notes.length > 500) {
      setError('Alasan tidak boleh lebih dari 500 karakter')
      return
    }
    onConfirm(notes.trim())
    setNotes('')
    setError('')
  }

  const handleClose = () => {
    setNotes('')
    setError('')
    onClose()
  }

  const handleNotesChange = (text: string) => {
    setNotes(text)
    if (error) setError('')
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text size={18} type="semibold" style={styles.title}>
            Konfirmasi Penolakan
          </Text>
          
          {rktData && (
            <View style={styles.rktInfo}>
              <Text size={14} color={theme.colors.grey}>Sub Aktivitas: {rktData.subActivity}</Text>
              <Text size={14} color={theme.colors.grey}>Organisasi: {rktData.organization}</Text>
              <Text size={14} color={theme.colors.grey}>Divisi: {rktData.division}</Text>
            </View>
          )}
          
          <Text size={14} style={styles.message}>
            Berikan alasan penolakan RKT ini:
          </Text>
          
          <TextInput
            placeholder="Alasan penolakan (wajib diisi)"
            value={notes}
            onChangeText={handleNotesChange}
            multiline
            numberOfLines={4}
            style={[styles.notesInput, error && styles.inputError]}
            maxLength={500}
          />
          
          <View style={styles.characterCount}>
            <Text size={12} color={theme.colors.grey}>
              {notes.length}/500 karakter
            </Text>
          </View>
          
          {error && (
            <Text size={12} color={theme.colors.red} style={styles.errorText}>
              {error}
            </Text>
          )}
          
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
                {loading ? 'Loading...' : 'Tolak'}
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
    marginBottom: 8,
    minHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.red,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  errorText: {
    marginBottom: 16,
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
    backgroundColor: '#EF5350',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
})

export default RejectDialog