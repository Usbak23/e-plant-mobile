export const emailValidator = (email: string) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/
  const re_enablingPlusIcon = /^.*@\w+([.-]?\w+)*(\.\w{2,})+$/

  if (!email || email.length <= 0) {
    return 'Email must not be empty'
  }
  if (!re_enablingPlusIcon.test(email)) {
    return 'Incorrect email format'
  }

  return ''
}

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) {
    return 'Password must not be empty'
  }
  if (password.length < 6) {
    return 'Password must have at least 6 characters'
  }

  return ''
}
