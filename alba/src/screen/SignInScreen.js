import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from "react-native";

export default function SignInScreen({navigation}) {
    return(
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>여기는 회원 가입 페이지</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})