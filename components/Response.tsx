import { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Button from './Button'
import importedFonts from '@/models/Fonts'
import { styles } from '@/models/Styles'
import { AppContext } from '@/context/appProvider'
import LottieView from 'lottie-react-native'
import { useFonts } from 'expo-font'

export type ResponseParams = {
    type: 'success' | 'fail' | 'alert' | 'lock'
    title: string,
    text: string,
    buttonTitle: string,
    onPress: any
    isLoop?: boolean
}

export default function Response({ type, title, text, buttonTitle, onPress, isLoop = false }: ResponseParams) {
    const [source, setSource] = useState<any>(require('../assets/animations/success-animation.json'))
    const { theme } = useContext<any>(AppContext)

    // Cores conforme o tema utilizado
    const contentTheme = theme == 'light' ? styles.contentThemeLight : styles.contentThemeDark
    const textTheme = theme == 'light' ? styles.textThemeLight : styles.textThemeDark

    useFonts(importedFonts)

    useEffect(() => {
        switch (type) {
            case 'success':
                setSource(require('../assets/animations/success-animation.json'))
                break
            case 'fail':
                setSource(require('../assets/animations/fail-animation.json'))
                break
            case 'alert':
                setSource(require('../assets/animations/alert-animation.json'))
                break
            case 'lock':
                setSource(require('../assets/animations/lock-animation.json'))
                break
        }
    }, [])

    return (
        <View style={[style.content, contentTheme]}>

            {/* Icon */}
            <LottieView
                source={source}
                autoPlay
                loop={isLoop}
                style={style.lottieAnimation}
            />

            {/* Text */}
            <Text style={[style.title, textTheme]}>{title}</Text>
            <Text style={[style.text, textTheme]}>{text}</Text>

            {/* Button */}
            <View style={style.button}>
                <Button title={buttonTitle} onPress={onPress} />
            </View>

        </View>
    )
}

const style = StyleSheet.create({
    content: {
        maxHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottieAnimation: {
        width: 300,
        height: 300,
        marginBottom: 8,
    },
    title: {
        fontSize: 44,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginBottom: 52,
    },
    button: {
        width: '100%',
    }
})
