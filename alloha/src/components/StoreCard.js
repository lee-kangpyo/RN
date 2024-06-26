import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from '../components/CustomBtn';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

export default function StoreCard({store, btntxt, onButtonPressed}) {
    const [mode, setMode] = useState(true);
    console.log(store.STAT);
    return (
    
    <View style={[styles.card, styles.row, {justifyContent:"space-between"}]}>
        {
        (mode)?
            <>
                <View style={styles.img}>
                    <FontAwesome5 name="coffee" size={16} color="black" />
                </View>
                <TouchableOpacity onPress={()=> setMode(!mode)} style={{alignItems:"flex-start", flex:1}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fonts.card_title, {marginBottom:4}]}>{store.CSTNA}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={fonts.card_txt}>{store.ZIPADDR} {store.ADDR}</Text>
                </TouchableOpacity>
            </>
        :
            <>
            <TouchableOpacity onPress={()=> setMode(!mode)} style={{alignItems:"flex-start", flex:1,}}>
                <Text style={[fonts.card_title, {marginBottom:4}]}>{store.CSTNA}</Text>
                <Text style={fonts.card_txt}>{store.ZIPADDR} {store.ADDR}</Text>
            </TouchableOpacity>
            </>
        }
        <View style={{width:4}}/>
        {
            (store.STAT == "지원하기")?
                <TouchableOpacity style={[styles.btn]} onPress={()=>onButtonPressed(store.CSTCO)}>
                    <Text style={fonts.btn_text}>지원</Text>
                </TouchableOpacity>
            :
                <View style={[styles.btn, {backgroundColor:theme.purple,}]}>
                    <Text style={fonts.btn_text}>{store.STAT}</Text>
                </View>
        }
        
    </View>
    

    );
}
const fonts = StyleSheet.create({
    card_title:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        color: "#111111"
    },
    card_txt:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        fontWeight: "500",
        color: "#777777"
    },
    btn_text:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF"
    }
})
const styles = StyleSheet.create({
    img:{
        marginRight:10,
        justifyContent:"center",
        alignItems:"center",
        width:32,
        height:32,
        borderWidth:1,
        borderRadius:50,
    },
    row:{
        flexDirection:"row"
    },
    card: {
        alignItems:"center",
        paddingHorizontal:16,
        paddingVertical:30,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        marginBottom:10,
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1,
            },
            android:{
                elevation :2,
            }
        })


        
    },
   
    btn:{
        width:80,
        alignItems:"center",
        borderRadius: 8,
        backgroundColor: "#3479EF",
        paddingVertical:7,
        paddingHorizontal:17.5,
    }
  });
  