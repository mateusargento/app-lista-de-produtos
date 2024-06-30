import { createContext, useState } from 'react'
import { ColorSchemeName, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import * as LocalAuthentication from 'expo-local-authentication'

function AppProvider({ children }: { children: any }) {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [theme, setTheme] = useState<ColorSchemeName>(useColorScheme())

    const router = useRouter()

    // Realiza a autenticação com a senha do dispositivo
    async function signIn() {
        const enrolledLevelAuth = await LocalAuthentication.getEnrolledLevelAsync()

        // Verifica se o dispositivo tem algum método de autenticação, caso tenha solicita
        // Se o resultado estiver entre 1 e 3, existe autenticação no dispositivo
        // Se o resultado for 0, não existe autenticação no dispositivo
        if (enrolledLevelAuth > 0) {
            const response = await LocalAuthentication.authenticateAsync()

            // Caso o login for bem sucedido, redireciona para a primeira página
            if (response.success === true) {
                setIsAuth(true)
                router.replace('(app)/')
            }
        } 
        // Se não existir nenhum método de autenticação, pula essa etapa
        else {
            setIsAuth(true)
            router.replace('(app)/')
        }
    }

    // Se não estiver autenticado, vai para a página de autenticação
    if (!isAuth) {
        signIn()
    }

    return (
        <AppContext.Provider value={{ theme, setTheme, isAuth, signIn }}>
            {children}
        </AppContext.Provider>
    )
}

export const AppContext = createContext({})
export default AppProvider
