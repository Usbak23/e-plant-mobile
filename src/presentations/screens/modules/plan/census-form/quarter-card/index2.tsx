import { Text, TextInput } from '@app/presentations/_shared-components'
import React from 'react'
import { useWatch } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'

interface IQuarterCardProps {
    item: any
    index: number
    controlSecondPage: any
    errorsSecondPage: any
    janjangPerBlok: string
    singleBlock: any
    setSecondPageValue: any
}

const QuarterCardV2: React.FC<IQuarterCardProps> = props => {
    const {
        item,
        index,
        controlSecondPage,
        errorsSecondPage,
        janjangPerBlok,
        singleBlock,
        setSecondPageValue
    } = props



    const persentaseWatcher = useWatch({
        control: controlSecondPage,
        name: `censusMonths.[${index}].percentage`,
        defaultValue: item?.percentage ? item?.percentage?.toString() : '',
    })

    const bjrWatcher = useWatch({
        control: controlSecondPage,
        name: `censusMonths.[${index}].bjr`,
        defaultValue: item?.bjr ? item?.bjr?.toString() : '',
    })

    const totalJanjangWatcher = useWatch({
        control: controlSecondPage,
        name: `censusMonths.[${index}].janjangPerMonth`,
        defaultValue: item?.janjangPerMonth ? item?.janjangPerMonth?.toString() : '',
    })

    const totalTonaseWatcher = useWatch({
        control: controlSecondPage,
        name: `censusMonths.[${index}].scatter`,
        defaultValue: item?.scatter ? item?.scatter?.toString() : ''
    })

    const yieldWatcher = useWatch({
        control: controlSecondPage,
        name: `censusMonths.[${index}].yield`,
        defaultValue: item?.yield ? item?.yield?.toString() : ''
    })


    //persentase * janjang per blok / 100
    const calculateTotalJanjang = (persentase?: string) => {
        const res = parseFloat(persentase || '') * parseFloat(janjangPerBlok) / 100
        const result = !res || isNaN(res) || !isFinite(res) ? '' : res.toFixed(2).toString()
        setSecondPageValue(`censusMonths.[${index}].janjangPerMonth`, result)
        calculateTotalTonase(result)
    }

    //total tonase = calculateTotalJanjang * bjr input
    const calculateTotalTonase = (janjangPerBlok?: string, bjr?: string) => {
        const res = parseFloat(janjangPerBlok || totalJanjangWatcher) * parseFloat(bjr || bjrWatcher)
        const result = !res || isNaN(res) || !isFinite(res) ? '' : res.toFixed(2).toString()
        setSecondPageValue(`censusMonths.[${index}].scatter`, result)
        calculateYield(result)
    }

    //yield = calculateTotalTonase / luasBlok
    const calculateYield = (totalTonase?: string) => {
        const res = parseFloat(totalTonase || '') / parseFloat(singleBlock?.blockArea || '0')
        const result = !res || isNaN(res) || !isFinite(res) ? '' : res.toFixed(2).toString()
        setSecondPageValue(`censusMonths.[${index}].yield`, result)
    }

    return (
        <View style={styles.root}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginEnd: 2 }}>
                    <TextInput
                        maxLines={1}
                        disabled
                        disabledText={item?.labelMonth || '-'}
                        control={controlSecondPage}
                        label="Bulan"
                        placeholder="Bulan"
                        name="month"
                        isRequired
                    />
                </View>
                <View style={{ flex: 1, marginStart: 2 }}>
                    <TextInput
                        isFloat={true}
                        isNumber
                        control={controlSecondPage}
                        label="Persentase"
                        placeholder="Contoh: 10"
                        name={`censusMonths.[${index}].percentage`}
                        errorText={errorsSecondPage?.[`censusMonths[${index}].percentage`]?.message || errorsSecondPage?.censusMonths?.message}
                        isRequired
                        onChangeText={v => {
                            calculateTotalJanjang(v)
                        }}
                    />
                </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginEnd: 2 }}>
                    <TextInput
                        isFloat={true}
                        isNumber
                        control={controlSecondPage}
                        label="BJR"
                        placeholder="Contoh: 10"
                        name={`censusMonths.[${index}].bjr`}
                        errorText={errorsSecondPage?.[`censusMonths[${index}].bjr`]?.message}
                        isRequired
                        onChangeText={v => {
                            calculateTotalTonase(undefined, v)
                        }}
                    />
                </View>
                <View style={{ flex: 1, marginStart: 2 }}>
                    <TextInput
                        maxLines={1}
                        disabled
                        disabledText={totalJanjangWatcher}
                        control={controlSecondPage}
                        label="Total Janjang"
                        placeholder="Total Janjang"
                        name={`censusMonths.[${index}].janjangPerMonth`}
                        errorText={errorsSecondPage?.[`censusMonths[${index}].janjangPerMonth`]?.message}
                        isRequired
                    />
                </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginEnd: 2 }}>
                    <TextInput
                        maxLines={1}
                        disabled
                        disabledText={totalTonaseWatcher}
                        control={controlSecondPage}
                        label="Total Tonase"
                        placeholder="Total Tonase"
                        name={`censusMonths?.[${index}].scatter`}
                        errorText={errorsSecondPage?.[`censusMonths[${index}].scatter`]?.message}
                        isRequired
                    />
                </View>
                <View style={{ flex: 1, marginStart: 2 }}>
                    <TextInput
                        maxLines={1}
                        disabled
                        disabledText={yieldWatcher}
                        control={controlSecondPage}
                        label="Yield (Ton/Ha)"
                        placeholder="Yield (Ton/Ha)"
                        name={`censusMonths?.[${index}].yield`}
                        errorText={errorsSecondPage?.[`censusMonths[${index}].yield`]?.message}
                        isRequired
                    />
                </View>
            </View>



        </View>
    )
}

export default QuarterCardV2

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
    },
})
