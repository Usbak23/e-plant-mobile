import { IDashboardChartRow } from '@app/models/eplant/Dashboard'
import { DashboardMoreButtons } from '@app/models/eplant/DashboardMoreButtonConstant'
import Routes from '@app/presentations/navigation/Routes'
import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'


interface Props {
    item: IDashboardChartRow
    query: {
        organizationId: string,
        divisionId: string,
        date: string,
      }
}

const SeeMoreButton: React.FC<Props> = (props) => {
    const navigation = useNavigation()
    const menus = DashboardMoreButtons.find(c => c.key == props.item.slug)?.menus || []


    const cardOptions = () => (
        <MenuOptions
            customStyles={{
                optionsContainer: {
                    padding: 8,
                    borderRadius: 10,
                },
            }}>
            {
                menus.map(({ label, route }: { label: string, route: string }, index: number) => (
                    <MenuOption key={index} onSelect={() => {
                        navigation.navigate(route, {query: props?.query})
                    }}>
                        <Text maxLines={1} style={{ marginVertical: 4, marginHorizontal: 8 }} size={12}>{label}</Text>
                    </MenuOption>
                ))
            }


        </MenuOptions>
    )
    return (
        <Menu>
            <MenuTrigger>
                <View style={{ padding: 10 }}>
                    <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
                </View>
            </MenuTrigger>
            {cardOptions()}
        </Menu>
    )
}

export default SeeMoreButton