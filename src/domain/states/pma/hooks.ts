import { IPMAEmployee, IPMAEmployeeFormData, IPMAEmployeeMerged, IPMAFormData, IPMAMerged } from '@app/models/eplant/PMA'
import { useSelector } from 'react-redux'
import { RootStateType } from '../store'

export const usePma = (divisionId: string, datePma: string, foremanId: string): IPMAMerged | undefined => {
  const { pmaList, pmaFormmTemp } = useSelector((state: RootStateType) => state.pma || {})
  if (pmaList?.data || Array.isArray(pmaFormmTemp)) {
    const pmaOnline =
      pmaList?.data?.division?.id == divisionId &&
        pmaList?.data?.foremanPma?.id == foremanId &&
        pmaList?.data?.datePma == datePma
        ? pmaList?.data
        : undefined
    const findTemp = pmaFormmTemp?.find(
      (p: IPMAFormData) => p.divisionId == divisionId && p.foremanId == foremanId && p.datePma == datePma,
    )
    const mergedEmployees: IPMAEmployeeMerged[] = []
    pmaOnline?.pmaEmployees?.forEach((e: IPMAEmployee) => {
      const obj: IPMAEmployeeMerged = {
        isDraft: false,
        id: e?.id,
        tempId: e?.tempId,
        user: {
          id: e?.user?.id,
          nip: e?.user?.nip,
          name: e?.user?.name,
        },
        role: {
          id: e?.role?.id,
          name: e?.role?.name,
        },
        block: {
          id: e?.block?.id,
          code: e?.block?.code,
        },
        plantingYear: e?.plantingYear,
        ancak: e?.ancak,
        notHarvestFruit: e?.notHarvestFruit,
        sunFruit: e?.sunFruit,
        looseOnPlateAndPikul: e?.looseOnPlateAndPikul,
        looseOnTph: e?.looseOnTph,
        brokenMidrib: e?.brokenMidrib,
        onPlateMidrib: e?.onPlateMidrib,
        checkedTree: e?.checkedTree,
        remainingFruitTree: e?.remainingFruitTree,
        brondolanEachTree: e?.brondolanEachTree
      }
      mergedEmployees.push(obj)
    })

    findTemp?.employee?.forEach((temp: IPMAEmployeeFormData) => {
      const obj: IPMAEmployeeMerged = {
        isDraft: true,
        employeeTempId: temp?.employeeTempId,
        user: {
          id: temp?.user?.id || '',
          nip: temp?.user?.nip || '',
          name: temp?.user?.name || '',
        },
        role: {
          id: temp?.user?.role?.id || '',
          name: temp?.user?.role?.name || '',
        },
        block: {
          id: temp?.block?.id || '',
          code: temp?.block?.code || '',
        },
        plantingYear: temp?.plantingYear,
        ancak: temp?.ancak,
        notHarvestFruit: temp?.notHarvestFruit,
        sunFruit: temp?.sunFruit,
        looseOnPlateAndPikul: temp?.looseOnPlateAndPikul,
        looseOnTph: temp?.looseOnTph,
        brokenMidrib: temp?.brokenMidrib,
        onPlateMidrib: temp?.onPlateMidrib,
        checkedTree: temp?.checkedTree,
        remainingFruitTree: temp?.remainingFruitTree,
        brondolanEachTree: temp?.brondolanEachTree
      }
      mergedEmployees.push(obj)
    })

    if (!pmaList?.data && !findTemp) {
      return undefined
    }

    const parent: IPMAMerged = {
      id: pmaOnline?.id,
      tempId: findTemp?.tempId,
      datePma: datePma,
      divisionId: pmaOnline?.division?.id || findTemp?.divisionId || '',
      foremanId: pmaOnline?.foremanPma?.id || findTemp?.foremanId || '',
      division: {
        id: pmaOnline?.division?.id || findTemp?.division?.id || '',
        name: pmaOnline?.division?.name || findTemp?.division?.name || '',
        organization: {
          id: pmaOnline?.division?.organization?.id || findTemp?.division?.organization?.id || '',
          name: pmaOnline?.division?.organization?.name || findTemp?.division?.organization?.name || '',
        },
      },
      foremanPma: {
        id: pmaOnline?.foremanPma?.id || findTemp?.foremanPma?.id || '',
        name: pmaOnline?.foremanPma?.name || findTemp?.foremanPma?.name || '',
        nip: pmaOnline?.foremanPma?.nip || findTemp?.foremanPma?.nip || '',
      },
      employee: mergedEmployees,
    }
    return parent
  }
  return undefined
}
