import {string} from 'yup/lib/locale'

export const dateFormatter = (date: any) => {
  if (typeof date !== 'string') {
    return date
  }
  if (!date) {
    return date
  }
  const splitted = date.split('T')[0]
  return splitted
}
