import { Platform, StatusBar, StyleSheet } from 'react-native'

export default StyleSheet.create({
    header: {
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
        flex: 1
    },
    background: {
        flex: 1,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
})