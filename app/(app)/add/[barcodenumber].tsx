import { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native'
import Button from '@/components/Button'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useCameraPermissions } from 'expo-camera'
import Sql from '@/models/Database'
import { styles } from '@/models/Styles'
import { AppContext } from '@/context/appProvider'
import Response, { ResponseParams } from '@/components/Response'
import { FontAwesome5 } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import importedFonts from '@/models/Fonts'

export default function Add() {
    const [barcode, setBarcode] = useState<string>('')
    const [productName, setProductName] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalParams, setModalParams] = useState<ResponseParams>()
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
    const { theme } = useContext<any>(AppContext)
    const barcodeInputRef = useRef<any>()
    const productNameInputRef = useRef<any>()

    const { barcodenumber } = useLocalSearchParams()
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const router = useRouter();
    useFonts(importedFonts)
    const navigation = useNavigation()

    // Cores conforme o tema utilizado
    const contentTheme = theme == 'light' ? styles.contentThemeLight : styles.contentThemeDark
    const textTheme = theme == 'light' ? styles.textThemeLight : styles.textThemeDark
    const inputTextTheme = theme == 'light' ? styles.inputTextThemeLight : styles.inputTextThemeDark

    // Acrescenta o número do código de barras ao input depois de ler com a câmera
    useEffect(() => {
        // Caso o valor for diferente da string 'undefined' ou de undefined, acrescenta o código de barras ao input
        if (barcodenumber != 'undefined' && barcode != undefined) {
            setBarcode(barcodenumber!.toString())
            setTimeout(() => productNameInputRef.current!.focus(), 250)
        }

        // Define as cores do header conforme o tema utilizado
        navigation.setOptions({
            headerTintColor: textTheme.color,
            headerStyle: {
                backgroundColor: inputTextTheme.backgroundColor,
            }
        })
    }, [])

    // Ao selecionar o botão para leitura de código de barras
    async function handleInputBarcode() {
        // Se não tiver permissão para acessar a câmera
        if (!cameraPermission?.granted) {
            // Faz a requisição para usar a câmera
            const response = await requestCameraPermission()

            // Se for negado acessar a câmera
            if (!response.granted) {
                setModalParams({
                    title: 'Aviso',
                    text: 'O aplicativo não tem permissão para acessar a câmera. Permita nas configurações do seu dispositivo para continuar',
                    onPress: () => {
                        setIsModalOpen(false)
                    },
                    type: 'alert',
                    buttonTitle: 'Voltar'
                })
                setIsModalOpen(true)
            }
            // Se for permitido acessar a câmera
            response.granted && router.replace('/camera')
        }
        // Se tiver permissão para acessar, abre a câmera
        else {
            router.replace('/camera')
        }

    }

    // Adiciona um novo produto na lista
    async function handleAddNewProduct() {
        // Desativa o botão até finalizar a requisição
        setIsButtonLoading(true)

        // Para adicionar um novo produto é necessário preencher todos os campos
        if (!barcode || !productName) {
            // Alerta que é necessário preencher todos os campos e interrompe a função
            setModalParams({
                title: 'Aviso',
                text: 'Preencha todos os campos para continuar',
                onPress: () => {
                    setIsModalOpen(false)
                },
                type: 'alert',
                buttonTitle: 'Voltar'
            })
            setIsModalOpen(true)
            // Ativa o botão
            setIsButtonLoading(false)

            return
        }

        try {
            // Requisição para cadastrar o produto do banco de dados
            const result = await Sql.store(parseInt(barcode.trim()), productName.trim())

            if (result.changes >= 1) {
                // Alerta que foi bem sucedido o cadastro do produto
                setModalParams({
                    title: 'Sucesso!',
                    text: 'O produto foi adicionado a lista com sucesso',
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
                    text: 'Ocorreu um erro ao cadastrar o produto',
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
                title: 'Erro!',
                text: 'Ocorreu um erro ao cadastrar o produto',
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
                <ScrollView keyboardShouldPersistTaps='handled' style={[style.content, contentTheme]}>

                    {/* Barcode */}
                    <View style={style.inputView}>
                        <Text style={[styles.label, { marginBottom: 4 }]}>Código de Barras</Text>
                        <View style={style.inputViewBarcode}>
                            <TextInput
                                value={barcode}
                                onChangeText={setBarcode}
                                onSubmitEditing={
                                    () => setTimeout(() => productNameInputRef.current!.focus(), 250)
                                }
                                keyboardType='numeric'
                                returnKeyType='next'
                                ref={barcodeInputRef}
                                style={[styles.textInput, inputTextTheme, { fontFamily: 'Poppins' }]}
                            />
                            <TouchableOpacity onPress={handleInputBarcode}>
                                <FontAwesome5 name='camera' style={[style.inputViewBarcodeButton, textTheme]} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Product Name */}
                    <View style={style.inputView}>
                        <Text style={[styles.label, { marginBottom: 4 }]}>Nome do produto</Text>
                        <TextInput
                            value={productName}
                            onChangeText={setProductName}
                            onSubmitEditing={handleAddNewProduct}
                            ref={productNameInputRef}
                            style={[styles.textInput, inputTextTheme, { fontFamily: 'Poppins' }]}
                        />
                    </View>

                    {/* Add new product button */}
                    <Button
                        title='Adicionar novo produto'
                        onPress={handleAddNewProduct}
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
        paddingVertical: 20,
    },
    inputView: {
        marginBottom: 16,
    },
    inputViewBarcode: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    inputViewBarcodeButton: {
        fontSize: 24,
        marginHorizontal: 10,
    },
})
