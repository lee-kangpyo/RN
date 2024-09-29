
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, Ionicons, AntDesign, MaterialIcons  } from '@expo/vector-icons';

export default function IconBtn({text, onPress, icon}) {
    const color = "white";
    const size = 24;
    return(
        <TouchableOpacity onPress={onPress} style={styles.grid}>
            {
                (icon)?
                    (icon.type == "FontAwesome")?
                        <FontAwesome name={icon.name} size={size} color={color} />
                    :(icon.type == "FontAwesome5")?
                        <FontAwesome5 name={icon.name} size={size} color={color} />
                    :(icon.type == "MaterialCommunityIcons")?
                        <MaterialCommunityIcons name={icon.name} size={size} color={color}/>
                    :(icon.type == "Ionicons")?
                        <Ionicons name={icon.name} size={size} color={color}/>
                    :(icon.type == "AntDesign")?
                        <AntDesign name={icon.name} size={size} color={color}/>
                    :(icon.type == "MaterialIcons")?    
                        <MaterialIcons name={icon.name} size={size} color={color} />
                    :
                        null
                :
                    null
            }
            <Text style={[styles.gridTxt, {color:color}]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    grid:{
        marginHorizontal:2,
        alignItems:"center"
    },
    gridTxt:{
        fontSize:10
    }
});