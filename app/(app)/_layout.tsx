import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import importedFonts from '@/models/Fonts'

export default function AppLayout() {
    useFonts(importedFonts)

    function options(title: string): any {
        return {
            title: title,
            headerTitleStyle: {
                fontSize: 18,
                fontFamily: 'Poppins-Bold'
            },
            headerTitleAlign: 'center',
        }
    }

    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen
                name='add/[barcodenumber]'
                options={options('Adicionar')}
            />
            <Stack.Screen
                name='product/[...productdata]'
                options={options('Detalhes do Produto')}
            />
            <Stack.Screen name='camera' options={{ headerShown: false, orientation: 'landscape' }} />
        </Stack>
    )
}
