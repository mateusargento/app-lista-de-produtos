import { StyleSheet, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { CameraView } from 'expo-camera'
import { useRouter } from 'expo-router'

export default function BarcodeScanner() {
    const router = useRouter()

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <CameraView
                    onBarcodeScanned={({ data }) => {
                        // Ao ler o código de barras, preenche o input do código de barras da página de adicionar novo produto
                        router.replace(`/add/${data}`)
                    }}
                    style={{ height: '100%' }}
                >
                    <View style={style.reader} />
                </CameraView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const style = StyleSheet.create({
    reader: {
        height: 3,
        backgroundColor: '#e00909',
        top: '50%',
    },
})
