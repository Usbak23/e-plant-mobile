import React, { useEffect } from 'react'
import { useNotifications } from '../hooks/useNotifications'

interface NotificationProviderProps {
  children: React.ReactNode
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  useNotifications()
  
  return <>{children}</>
}

export default NotificationProvider