import { StyleSheet  } from 'react-native'

export const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        fontFamily: 'Poppins',
    },
    textBold: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins',
        color: 'grey',
    },
    textInput: {
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#b2b2b2',
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexGrow: 1,
    },
    button: {
        minHeight: 32,
        backgroundColor: '#2196F3',
        borderRadius: 4,
        padding: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#f2f2f2',
        textAlign: 'center',
    },
    contentThemeLight: {
        height: '100%',
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 20,
    },
    contentThemeDark: {
        height: '100%',
        backgroundColor: '#2e2e2e',
        paddingHorizontal: 20,
    },
    textThemeLight: {
        color: '#1f1f1f',
    },
    textThemeDark: {
        color: '#f2f2f2',
    },
    inputTextThemeLight: {
        backgroundColor: '#f2f2f2',
        color: '#1f1f1f',
    },
    inputTextThemeDark: {
        backgroundColor: '#1f1f1f',
        color: '#f2f2f2',
    },
    tileThemeLight: {
        backgroundColor: '#e8e8e8',
        borderRadius: 12,
        marginVertical: 8,
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tileThemeDark: {
        backgroundColor: '#404040',
        borderRadius: 12,
        marginVertical: 8,
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})
