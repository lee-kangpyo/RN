import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity } from 'react-native';

export const addComma = (number) => {
    const convertedNumber = number || 0;
    return convertedNumber.toLocaleString();
}

export const headerTitleStyle = {
    fontFamily: "SUIT-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    
}

export const headerLeftComponent = (title) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection:"row", alignItems:"center"}}>
            <Image source={require('../../assets/icons/goBack.png')} style={{width:13, height:22, marginRight:20}}/>
            {
                (title)?<Text style={headerTitleStyle}>{title}</Text>:null
            }
        </TouchableOpacity>
    )
}