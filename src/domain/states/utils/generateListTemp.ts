const generateListTemp = (docs?: any[], listTemp?: any[]) => {
  const listAdd = listTemp?.map(e => ({...e, isTemp: true})) || []
  const result = [...listAdd, ...(docs || [])]
  return result
}

export default generateListTemp
