import { useContext } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import importedFonts from '@/models/Fonts'
import { styles } from '@/models/Styles'
import { AppContext } from '@/context/appProvider'
import { Link } from 'expo-router'
import { useFonts } from 'expo-font'

export default function Tile({ item }: { item: any; }) {
    const barcode: number = item.barcode;
    const productName: string = item.name;
    const { theme } = useContext<any>(AppContext);

    // Cores conforme o tema utilizado
    const tileTheme = theme === 'light' ? styles.tileThemeLight : styles.tileThemeDark
    const textTheme = theme === 'light' ? styles.textThemeLight : styles.textThemeDark;

    useFonts(importedFonts);

    return (
        <Link href={`/product/${barcode}/${productName}`} asChild>
            <TouchableOpacity
                style={tileTheme}
            >
                <Text style={[style.tileText, textTheme]}>{productName}</Text>
                <FontAwesome5 name='chevron-right' size={16} color={textTheme.color} />
            </TouchableOpacity>
        </Link>
    );
}


export const style = StyleSheet.create({
    tileText: {
        fontSize: 14,
        fontFamily: 'Poppins'
    }
})
