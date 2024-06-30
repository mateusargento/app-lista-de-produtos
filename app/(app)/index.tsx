import { useCallback, useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Modal, RefreshControl, ActivityIndicator, Switch, Appearance } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Sql from '@/models/Database'
import { Link } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import { styles } from '@/models/Styles'
import Tile from '@/components/Tile'
import { useFonts } from 'expo-font'
import importedFonts from '@/models/Fonts'
import Button from '@/components/Button'
import Response, { ResponseParams } from '@/components/Response'
import { AppContext } from '@/context/appProvider'

export default function Home() {
    const [list, setList] = useState<Array<any>>([])
    const [listSearch, setListSearch] = useState<Array<any>>([])
    const [searchValue, setSearchValue] = useState<string>('')
    const [searchedValue, setSearchedValue] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalParams, setModalParams] = useState<ResponseParams>()
    const [refreshControl, setRefreshControl] = useState<boolean>(false)
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
    const { theme, setTheme } = useContext<any>(AppContext)

    useFonts(importedFonts)
    const contentTheme = theme == 'light' ? styles.contentThemeLight : styles.contentThemeDark
    const textTheme = theme == 'light' ? styles.textThemeLight : styles.textThemeDark
    const inputTextTheme = theme == 'light' ? styles.inputTextThemeLight : styles.inputTextThemeDark

    useEffect(() => {
        // Lista os produtos cadastrados no banco de dados
        async function loadList() {
            const result = await Sql.index()

            // Se houver resultados, adiciona a lista de produtos
            result && setList(result)
        }

        loadList()
    }, [list, listSearch])

    // Utilizado no componente Refresh Control
    const onRefresh = useCallback(() => {
        setRefreshControl(true)
        setList([])
        setListSearch([])
        setRefreshControl(false)
    }, []);

    // Pesquisa um produto pelo código de barras ou pelo seu nome
    async function handleSearch(): Promise<void> {
        // É necessário preencher o campo de texto antes de pesquisar
        if (!searchValue) {
            setModalParams({
                title: 'Aviso',
                text: 'Para pesquisar, preencha o campo de texto',
                onPress: () => {
                    setIsModalOpen(false)
                },
                type: 'alert',
                buttonTitle: 'Voltar'
            })
            setIsModalOpen(true)

            return
        }

        // Desativa o botão
        setIsButtonLoading(true)

        try {
            const result = await Sql.index(searchValue.trim())

            // Caso não seja encontrado resultado na pesquisa
            if (result.length <= 0) {
                setModalParams({
                    title: 'Aviso',
                    text: 'Nenhum resultado foi encontrado na pesquisa',
                    onPress: () => {
                        setIsModalOpen(false)
                    },
                    type: 'alert',
                    buttonTitle: 'Voltar'
                })
                setIsModalOpen(true)

                setListSearch([])
                setSearchedValue('')

                return
            }

            // Se for encontrado, adiciona o termo pesquisado no hook e o resultado na lista de produtos da pesquisa
            setSearchedValue(searchValue)
            setListSearch(result)
        } catch (error) {
            // Caso seja caputurado algum erro
            setModalParams({
                title: 'Erro!',
                text: 'Ocorreu um erro ao filtrar o produto',
                onPress: () => {
                    setIsModalOpen(false)
                },
                type: 'fail',
                buttonTitle: 'Voltar'
            })
            setIsModalOpen(true)
        } finally {
            // Ativa o botão
            setIsButtonLoading(false)
        }
    }

    return (
        <SafeAreaProvider style={{backgroundColor: contentTheme.backgroundColor}}>
            <SafeAreaView>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    refreshControl={
                        <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
                    }
                    style={contentTheme}
                >

                    {/* Search Bar */}
                    <View style={style.search}>
                        <TextInput
                            value={searchValue}
                            onChangeText={setSearchValue}
                            placeholder='Código de barras ou nome do produto'
                            placeholderTextColor={textTheme.color}
                            onSubmitEditing={handleSearch}
                            style={[styles.textInput, inputTextTheme, { fontFamily: 'Poppins' }]}
                        />
                        {
                            isButtonLoading
                                ? <ActivityIndicator size={20} color='black' style={style.searchButton} />
                                : <TouchableOpacity onPress={handleSearch}>
                                    <FontAwesome5 name='search' style={[style.searchButton, textTheme]} />
                                </TouchableOpacity>
                        }
                    </View>

                    {/* Add button */}
                    <View style={style.addButton}>
                        <Link href={'/add/undefined'} asChild>
                            <Button title='Adicionar' />
                        </Link>
                    </View>

                    {/* Switch Theme */}
                    <View style={style.switchTheme}>
                        <FontAwesome5 name='sun' style={[textTheme, { fontSize: 20 }]} />
                        <Switch
                            value={theme == 'light' ? false : true}
                            onChange={() => {
                                if (theme === 'light') {
                                    setTheme('dark')
                                    Appearance.setColorScheme('dark')
                                    navigator
                                } else {
                                    setTheme('light')
                                    Appearance.setColorScheme('light')
                                }
                            }}
                        />
                        <FontAwesome5 name='moon' style={[textTheme, { fontSize: 20 }]} />
                    </View>

                    {/* List */}
                    {
                        list.length <= 0
                            ? <Text style={[styles.text, textTheme, { textAlign: 'center' }]}>Nenhum produto cadastrado</Text>
                            : <>
                                {
                                    // Se for realizada uma pesquisa e retornar resultados, mostra o termo pesquisado
                                    listSearch.length > 0 && <Text style={[textTheme, { marginBottom: 8 }]}>
                                        Mostrando resultado para pesquisa: <Text style={styles.textBold}>"{searchedValue.trim()}"</Text>
                                    </Text>
                                }
                                <FlatList
                                    // Se for realizada uma pesquisa e retornar resultados, mostra ela
                                    // Se não mostra todos os resultados
                                    data={listSearch.length > 0 ? listSearch : list}
                                    renderItem={({ item }) => <Tile item={item} />}
                                    scrollEnabled={false}
                                />
                            </>
                    }

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
        </SafeAreaProvider >
    )

}

const style = StyleSheet.create({
    search: {
        width: '100%',
        marginTop: 32,
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchButton: {
        fontSize: 20,
        color: '#1f1f1f',
        marginHorizontal: 10,
    },
    addButton: {
        marginBottom: 8,
    },
    switchTheme: {
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    }
})
