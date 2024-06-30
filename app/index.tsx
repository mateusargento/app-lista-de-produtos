import { Pressable, SafeAreaView, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Response from '@/components/Response'
import { useContext, useEffect } from 'react'
import { SplashScreen, router } from 'expo-router'
import { styles } from '@/models/Styles'
import { AppContext } from '@/context/appProvider'

// Aguarda na splash screen até tudo ser carregado
SplashScreen.preventAutoHideAsync()

export default function AppHome() {
    const { theme, signIn, isAuth } = useContext<any>(AppContext)
    const contentTheme = theme === 'light' ? styles.contentThemeLight : styles.contentThemeDark

    useEffect(() => {
        async function handleSplashScreen() {
            // Remove a splash screen
            await SplashScreen.hideAsync()
        }

        handleSplashScreen()
    }, [isAuth])

    return (
        <SafeAreaProvider style={{ backgroundColor: contentTheme.backgroundColor }}>
            <SafeAreaView>
                <Response
                    type='lock'
                    title='Bloqueado'
                    text='Para entrar, desbloqueie com a senha do seu dispositivo'
                    buttonTitle='Desbloquear'
                    onPress={() => signIn()}
                    isLoop={true}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
