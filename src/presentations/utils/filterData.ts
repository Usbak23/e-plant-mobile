export const filterData = (data: any[] = [], option = '', sortBy = '') => {
  const filtered = data.filter(item =>
    Object.keys(item).some(
      key =>
        typeof item[key] === 'string' && item[key].toString().toLowerCase().includes(option.toString().toLowerCase()),
    ),
  )
  return filtered
}
