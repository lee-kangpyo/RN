import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from '../components/CustomBtn';

export default function StoreCard({store, btntxt, onButtonPressed}) {
    
    return (
    <View style={styles.card}>
        <Text style={styles.card_title}>{store.CSTNA}</Text>
        <Text style={styles.card_txt}>{store.ZIPADDR} {store.ADDR}</Text>
        <CustomBtn txt={btntxt} onPress={()=>{onButtonPressed(store)}} style={styles.btn} color='black' fSize={16}/>
    </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width:"100%",
        padding:8,
        marginBottom:8,
        borderColor:theme.grey,
        borderWidth:1,
        borderRadius:5,
    },
    card_title:{
        fontSize:20
    },
    card_txt:{
        fontSize:16,
        color:theme.darkGrey
    },
    btn:{
        alignSelf:"flex-end",
        backgroundColor:"white",
        width:120,
        height:40
    }
  });
  