import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import CustomBtn from '../components/CustomBtn';


export default function Main() {
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.titleArea}>
            <Text style={styles.title}>알바관리</Text>
            <Text>Ver 0.01</Text>
        </View>
        <View style={styles.btnGrp}>
            <CustomBtn txt="알바 로그인" onPress={()=>{}} style={styles.btn} color='black'/>
            <CustomBtn txt="구글 로그인" onPress={()=>{Alert.alert("알림", "준비중입니다.")}} style={styles.btn} color='black'/>
            <Text style={styles.createAcc}>계정 만들기</Text>
        </View>
        

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea:{
    flex:2,
    alignItems:"center",
    justifyContent:"center",
  },
  title:{
    fontSize:40,
    fontWeight:"400"
  },
  btnGrp:{
    flex:1,
  },
  btn:{
    width: 175,
    height: 43,
    backgroundColor: "#D9D9D9",
    marginBottom:16,
  },
  createAcc:{
    textDecorationLine:'underline',
    color:"grey",
    fontSize:16,
    textAlign:"center"
  }
});
