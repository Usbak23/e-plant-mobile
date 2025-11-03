import {IConfig} from '@root/Config'
import {CallbackOrObserver} from '@app/domain/services/types'

export type FirebaseUser = any
export type UserCredential = any
export type AuthListenerCallback = (user: FirebaseUser | null) => void

class AuthenticationService {
  private readonly config: IConfig
  private auth: any

  constructor(config: IConfig) {
    this.config = config
    this.auth = {}
  }

  onAuthStateChanged = (listener: CallbackOrObserver<AuthListenerCallback>) => this.auth.onAuthStateChanged(listener)

  signOut = async (): Promise<void> => this.auth.signOut()

  signInOrRegisterWithGoogle = async (): Promise<UserCredential> => {
    return () => {}
  }

  signInWithEmailAndPassword = (email: string, password: string): Promise<UserCredential> => {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  createAccountWithEmailAndPassword = (email: string, password: string): Promise<UserCredential> => {
    return this.auth.createUserWithEmailAndPassword(email, password)
  }

  updateFirebaseProfile = (user: {displayName: string}): Promise<void> | undefined => {
    return this.auth?.currentUser?.updateProfile(user)
  }

  sendPasswordResetEmail = (email: string): Promise<void> => {
    return this.auth.sendPasswordResetEmail(email)
  }

  verifyPasswordResetCode = (code: string): Promise<void> => {
    return this.auth.verifyPasswordResetCode(code)
  }

  confirmPasswordReset = (code: string, newPassword: string): Promise<void> => {
    return this.auth.confirmPasswordReset(code, newPassword)
  }

  getIdToken = (): Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(async (user: FirebaseUser | null) => {
        unsubscribe()
        try {
          if (user) {
            const idToken = await user.getIdToken()
            resolve(idToken)
          }
          resolve(null)
        } catch (e) {
          resolve(null)
        }
      })
    })
  }

  deleteUser = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        this.auth.currentUser?.delete()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default AuthenticationService
