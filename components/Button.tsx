import { ActivityIndicator, Pressable, Text } from 'react-native'
import { useFonts } from 'expo-font'
import importedFonts from '@/models/Fonts'
import { styles } from '@/models/Styles'

export type ButtonParams = {
    title: string,
    onPress?: any,
    isLoadingButton?: boolean
    isDisabled?: boolean
}

export default function Button({ title, onPress, isLoadingButton, isDisabled = false }: ButtonParams) {
    useFonts(importedFonts)

    return (
        <>
            <Pressable onPress={onPress} style={styles.button} disabled={isDisabled}>
                {
                    isLoadingButton
                        ? <ActivityIndicator size={23.4} color='white' />
                        : <Text style={[styles.buttonText, { fontFamily: 'Poppins-Regular' }]}>
                            {title}
                        </Text>
                }
            </Pressable>
        </>
    )
}
