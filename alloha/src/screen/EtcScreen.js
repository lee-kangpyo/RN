
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import { FontAwesome5, MaterialCommunityIcons  } from '@expo/vector-icons';

export default function EtcScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"기타"})
    }, [navigation])

    return (
        <View style={[styles.container, {flexDirection:"row"}]}>
            <GridBox 
                text={"점포관리"} 
                onPress={()=>navigation.push("storeList")} 
                icon={{type:"FontAwesome5", name:"store", size:48, color:"black"}} 
            />   
            <GridBox 
                text={"알바관리"} 
                onPress={()=>navigation.push("ManageCrew")}
                icon={{type:"MaterialCommunityIcons", name:"badge-account-horizontal", size:48, color:"black"}}
            />   
        </View>
    );
}

function GridBox({text, onPress, icon}){
    return(
        <TouchableOpacity onPress={onPress} style={styles.grid}>
            {
                (icon)?
                    (icon.type == "FontAwesome5")?
                        <FontAwesome5 name={icon.name} size={icon.size} color={icon.color} />
                    :(icon.type == "MaterialCommunityIcons")?
                        <MaterialCommunityIcons name={icon.name} size={icon.size} color={icon.color}/>
                    :
                        null
                :
                    null
            }
            <Text style={styles.gridTxt}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    grid:{
        margin:5,
        padding:20,
        borderWidth:1,
        borderColor:"grey",
        borderRadius:5,
        alignItems:"center"
    },
    gridTxt:{
        marginTop:10,
        fontSize:16
    }
});