import AppProvider from '@/context/appProvider'
import { Stack } from 'expo-router'

export default function RootLayout() {
    return (
        <AppProvider>
            <Stack>
                <Stack.Screen
                    name='index'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='(app)'
                    options={{ headerShown: false }}
                />
            </Stack>
        </AppProvider>
    )
}
