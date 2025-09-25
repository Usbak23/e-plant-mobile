import * as yup from 'yup'

export let validationSchemaFirstPage = yup.object().shape({
  blockId: yup.string().required('Blok wajib diisi'),
  subActivityId: yup.string().required('Sub Activity wajib diisi'),
  hectaresTomorrow: yup.string().required('Ha Esok Hari wajib diisi'),
  //..added
  totalPlanHectare: yup.string().required('Total Ha wajib diisi'),
  hkPerHa: yup.string().required('HK Per Ha wajib diisi'),
  totalPlanHk: yup.string().required('Total Plan HK wajib diisi'),
})
