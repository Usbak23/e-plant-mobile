export const checkIfDuplicateExists = (arr: any[]) => {
  return new Set(arr).size !== arr.length
}
