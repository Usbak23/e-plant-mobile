import { Button, Text, TextInput } from '@app/presentations/_shared-components'
import React from 'react'
import { useWatch } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import QuarterCard from '../quarter-card'
import QuarterCardV2 from '../quarter-card/index2'
import { theme } from '@app/presentations/utils/styles'


interface ISecondPageProps {
    controlSecondPage: any
    errorsSecondPage: any
    handleSubmitSecondPage: any
    getValuesFirstPage: any
    getValuesSecondPage: any
    validateSecondStep: any
    resetSecondPage: any
    goToFirstStep: any
    singleBlock: any
    isEdit?: boolean
    censusMonthsFields: any
    setValuesSecondPage: any
}

const SecondPageV2: React.FC<ISecondPageProps> = props => {
    const {
        controlSecondPage,
        errorsSecondPage,
        handleSubmitSecondPage,
        getValuesFirstPage,
        getValuesSecondPage,
        validateSecondStep,
        goToFirstStep,
        singleBlock,
        isEdit,
        censusMonthsFields,
        setValuesSecondPage,
    } = props


    //total pokok/pohon diperiksa
    const totalTreeCheckedWatcher = useWatch({
        control: controlSecondPage,
        name: 'totalTreeChecked',
        defaultValue: getValuesSecondPage('totalTreeChecked') || '',
    })

    //total janjang diperiksa
    const totalFruitWatcher = useWatch({
        control: controlSecondPage,
        name: 'totalFruit',
        defaultValue: getValuesSecondPage('totalFruit') || '',
    })


    //Rata2 janjang
    const averageFruitWatcher = useWatch({
        control: controlSecondPage,
        name: 'averageFruit',
        defaultValue: getValuesSecondPage('averageFruit') || ''
    })


    //Janjang perblok
    const janjangPerBlokWatcher = useWatch({
        control: controlSecondPage,
        name: 'totalFruitOfBlock',
        defaultValue: getValuesSecondPage('totalFruitOfBlock') || '',
    })

    //cek sensusmonths
    const monthsWatcher = useWatch({
        control: controlSecondPage,
        name: 'censusMonths',
        defaultValue: getValuesSecondPage('censusMonths') || []
    })


    //menghitung rata-rata janjang diperiksa
    const calculateAverageFruit = (jumlahPokokDiperiksa?: string, janjangDiperiksa?: string) => {
        const res = parseFloat(janjangDiperiksa || totalFruitWatcher) / parseFloat(jumlahPokokDiperiksa || totalTreeCheckedWatcher)
        const result = !res || isNaN(res) || !isFinite(res) ? '' : res.toFixed(2).toString()
        setValuesSecondPage(`averageFruit`, result)
        calculateAverageFruitPerBlock(result)
    }

    //menghitung rata2 janjang per blok
    const calculateAverageFruitPerBlock = (rataRatJanjang: string) => {
        const avgFruit = parseFloat(rataRatJanjang)
        const res = avgFruit * parseFloat(getValuesFirstPage('totalTree') || '')
        const result = !res || isNaN(res) || !isFinite(res) ? '' : res.toFixed(2).toString()
        setValuesSecondPage(`totalFruitOfBlock`, result)
    }

    //BJR per blok
    const calculateBJRPerBlok = () => {
        let akumulasiTonaseSetiapBulan = 0
        let akumulasiJanjangSetiapBulan = 0
        monthsWatcher && Array.isArray(monthsWatcher) && monthsWatcher.forEach((census) => {
            akumulasiTonaseSetiapBulan += parseFloat(census.scatter || '0')
            akumulasiJanjangSetiapBulan += parseFloat(census.janjangPerMonth || '0')
        })
        const result = akumulasiTonaseSetiapBulan / akumulasiJanjangSetiapBulan
        return !result || isNaN(result) || !isFinite(result) ? '-' : result.toFixed(2).toString()
    }

    // Tonase per blok
    const calculateTonasePerBlok = () => {
        let result = 0
        monthsWatcher && Array.isArray(monthsWatcher) && monthsWatcher.forEach((census) => {
            result += parseFloat(census.scatter || '0')
        })
        return !result || isNaN(result) || !isFinite(result) ? '-' : result.toFixed(2).toString()
    }

    // Yield Ton/Ha
    const calculateYieldTonHa = () => {
        let result = 0
        monthsWatcher && Array.isArray(monthsWatcher) && monthsWatcher.forEach((census) => {
            result += parseFloat(census.yield || '0')
        })
        return !result || isNaN(result) || !isFinite(result) ? '-' : result.toFixed(2).toString()
    }


    return <View>
        <TextInput
            isNumber
            control={controlSecondPage}
            label="Pokok Diperiksa"
            placeholder="Contoh: 100"
            name="totalTreeChecked"
            errorText={errorsSecondPage?.totalTreeChecked?.message}
            isRequired
            onChangeText={v => {
                calculateAverageFruit(v)
            }}
        />

        <TextInput
            isNumber
            control={controlSecondPage}
            label="Janjang Diperiksa"
            placeholder="Contoh: 100"
            name="totalFruit"
            errorText={errorsSecondPage?.totalFruit?.message}
            isRequired
            onChangeText={v => {
                calculateAverageFruit(undefined, v)
            }}
        />

        <TextInput
            disabled
            disabledText={averageFruitWatcher}
            control={controlSecondPage}
            label="Rata-rata Janjang (Janjang diperiksa/Pokok diperiksa)"
            placeholder="Contoh: 100"
            name="averageFruit"
            errorText={errorsSecondPage?.averageFruit?.message}
            isRequired
        />

        <TextInput
            disabled
            disabledText={janjangPerBlokWatcher}
            control={controlSecondPage}
            label="Janjang per Blok (Rata-rata Janjang x Jumlah Pokok)"
            placeholder="Contoh: 100"
            name="totalFruitOfBlock"
            errorText={errorsSecondPage?.totalFruitOfBlock?.message}
            isRequired
        />

        <TextInput
            disabled
            disabledText={calculateBJRPerBlok()}
            control={controlSecondPage}
            label="BJR Per Blok"
            name="bjr"
            errorText={errorsSecondPage?.totalTonnage?.message}
        />

        <TextInput
            disabled
            disabledText={calculateTonasePerBlok()}
            control={controlSecondPage}
            label="Tonase Per Blok"
            placeholder="Contoh: 100"
            name="totalTonnage"
            errorText={errorsSecondPage?.totalTonnage?.message}
        />

        <TextInput
            disabled
            disabledText={calculateYieldTonHa()}
            control={controlSecondPage}
            label="Yield (Ton/Ha)"
            placeholder="Contoh: 10"
            name="tonnagePerHectare"
            errorText={errorsSecondPage?.tonnagePerHectare?.message}
        />

        <Text style={{ marginTop: 16, marginBottom: 8 }} color={theme.colors.textThinBlack} type='semibold'>Sensus Perbulan</Text>
        {censusMonthsFields.map((i: any, index: number) => (
            <QuarterCardV2
                item={i}
                index={index}
                controlSecondPage={controlSecondPage}
                errorsSecondPage={errorsSecondPage}
                janjangPerBlok={janjangPerBlokWatcher}
                singleBlock={singleBlock}
                setSecondPageValue={setValuesSecondPage}
            />
        ))}




        <View style={styles.prevNextView}>
            <Button style={{ marginBottom: 26 }} onPress={goToFirstStep}>
                <Text color="white">Sebelumnya</Text>
            </Button>
            <Button style={{ marginBottom: 26 }} onPress={handleSubmitSecondPage(validateSecondStep)}>
                <Text color="white">Simpan</Text>
            </Button>
        </View>
    </View>
}

export default SecondPageV2

const styles = StyleSheet.create({
    prevNextView: {
        marginVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})
