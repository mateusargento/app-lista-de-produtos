import { useContext, useEffect, useState } from 'react'
import { Text, StyleSheet, Modal, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import Button from '@/components/Button'
import { useFonts } from 'expo-font'
import importedFonts from '@/models/Fonts'
import Sql from '@/models/Database'
import Response, { ResponseParams } from '@/components/Response'
import { styles } from '@/models/Styles'
import { AppContext } from '@/context/appProvider'

export default function Product() {
    const [barcode, setBarcode] = useState<number>(0)
    const [productName, setProductName] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalParams, setModalParams] = useState<ResponseParams>()
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
    const { theme } = useContext<any>(AppContext)

    const { productdata } = useLocalSearchParams()
    useFonts(importedFonts)
    const router = useRouter()
    const navigation = useNavigation()

    // Cores conforme o tema utilizado
    const contentTheme = theme == 'light' ? styles.contentThemeLight : styles.contentThemeDark
    const textTheme = theme == 'light' ? styles.textThemeLight : styles.textThemeDark
    const inputTextTheme = theme == 'light' ? styles.inputTextThemeLight : styles.inputTextThemeDark

    useEffect(() => {
        const barcode = parseInt(productdata![0]?.toString() ?? '')
        const productName = productdata![1]?.toString() ?? ''

        setBarcode(barcode)
        setProductName(productName)

        // Define as cores do header conforme o tema utilizado
        navigation.setOptions({
            headerTintColor: textTheme.color,
            headerStyle: {
                backgroundColor: inputTextTheme.backgroundColor,
            }
        })
    }, [])

    // Remove um produto da lista
    async function handleDelete(): Promise<void> {
        // Desativa o botão até finalizar a requisição
        setIsButtonLoading(true)

        try {
            // Requisição para excluir o produto do banco de dados
            const result = await Sql.del(barcode)

            // Caso a exclusão tenha sido realizada, é confirmada por um alerta
            if (result.changes >= 1) {
                // Alerta que foi bem sucedido o cadastro do produto
                setModalParams({
                    title: 'Sucesso!',
                    text: 'O produto foi excluido da lista com sucesso',
                    onPress: () => {
                        router.back()
                        setIsModalOpen(false)
                    },
                    type: 'success',
                    buttonTitle: 'Voltar'
                })
                setIsModalOpen(true)
                // Ativa o botão
                setIsButtonLoading(false)
            } else {
                // Caso a exclusão não tenha sido realizada, é confirmada por um alerta
                setModalParams({
                    title: 'Erro',
                    text: 'Ocorreu um erro ao excluir o produto',
                    onPress: () => {
                        setIsModalOpen(false)
                    },
                    type: 'fail',
                    buttonTitle: 'Voltar'
                })
                setIsModalOpen(true)
                // Ativa o botão
                setIsButtonLoading(false)
            }
        } catch (error) {
            // Caso seja caputurado algum erro
            setModalParams({
                title: 'Erro',
                text: 'Ocorreu um erro ao excluir o produto',
                onPress: () => {
                    setIsModalOpen(false)
                },
                type: 'fail',
                buttonTitle: 'Voltar'
            })
            setIsModalOpen(true)
            // Ativa o botão
            setIsButtonLoading(false)
        }
    }

    return (
        <SafeAreaProvider style={{backgroundColor: contentTheme.backgroundColor}}>
            <SafeAreaView>
                <ScrollView  keyboardShouldPersistTaps='handled' style={[style.content, contentTheme]}>

                    {/* Product Info */}
                    <View style={style.productInfo}>
                        <Text style={[styles.textBold, textTheme, { marginBottom: 4 }]}>
                            Código de Barras: <Text style={[styles.text, textTheme]}>{barcode?.toString()}</Text>
                        </Text>
                        <Text style={[styles.textBold, textTheme]}>
                            Produto: <Text style={[styles.text, textTheme]}>{productName}</Text>
                        </Text>
                    </View>

                    {/* Delete Button */}
                    <Button
                        title='Excluir'
                        onPress={handleDelete}
                        isLoadingButton={isButtonLoading}
                        isDisabled={isButtonLoading}
                    />

                    {/* Modal */}
                    <Modal
                        visible={isModalOpen}
                        animationType='fade'
                    >
                        <Response
                            title={modalParams?.title ?? ''}
                            text={modalParams?.text ?? ''}
                            buttonTitle={modalParams?.buttonTitle ?? ''}
                            onPress={modalParams?.onPress ? modalParams?.onPress : () => { }}
                            type={modalParams?.type ?? 'success'}
                        />
                    </Modal>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const style = StyleSheet.create({
    content: {
        paddingVertical: 40
    },
    productInfo: {
        marginBottom: 24,
    },
})
