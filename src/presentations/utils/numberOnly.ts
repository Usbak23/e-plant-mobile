const numberOnly = (text: string, isFloating?: boolean) => {
  if (isFloating) {
    return text ? text?.replace(/[^0-9\.]/g, '') : ''
  }
  return text ? text?.replace(/[^0-9]/g, '') : ''
}
export default numberOnly
