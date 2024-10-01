import { StyleSheet, View } from "react-native"

export default function LayerPopUP ({body}) {
    return(
        <View style={styles.container}>
            <View style={styles.layer}>
                {body}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:"absolute",
        zIndex:99,
        backgroundColor:"rgba(0,0,0,0.5)",
        height:"100%",
        width:"100%",
        justifyContent:"center",
        alignItems:"center"
    },
    layer:{
        position:"absolute",
        backgroundColor:"white",
        padding:15,
        borderRadius:5
    }
})