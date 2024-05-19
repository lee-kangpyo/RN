import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

/**
 * Description placeholder
 *
 * @export
 * @param {{ data: list; onTap: function; }} props
 * @param {list} props.data - 탭이름이 들어간 리스트 ["탭1", "탭1"]
 * @param {function} props.onTap - 탭이 터치되면 호출될 함수 리스트의 몇번째가 터치되었는지 알려줌.
 */
export default function TapContainer ({data, onTap}){
    const [tapNum, setTapNum] = useState(0);
    useEffect(()=>{
        onTap(tapNum);
    }, [tapNum]);
    return (
        <View style={tap.container}>
            {
                data.map((el, idx) => {
                    return <Tap key={idx} text={el} selected={idx == tapNum} onTap={()=>setTapNum(idx)}/>
                })
            }
        </View>
    )
}

const Tap = ({text, selected, onTap}) => {
    const selectedText = {fontFamily: "SUIT-ExtraBold", color: "#3479EF"}
    const selectedTap = {borderBottomColor:"#3479EF"}
    return (
        <TouchableOpacity activeOpacity={1} onPress={onTap} style={[tap.tap, (selected)?selectedTap:null]}>
            <Text style={[fonts.tapText, (selected)?selectedText:null]}>{text}</Text>
        </TouchableOpacity>
    )
}

const fonts = StyleSheet.create({
    tapText:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        color: "#999999"
    }
})

const tap = StyleSheet.create({
    container:{
        backgroundColor:"#FFF",
        flexDirection:"row",
        justifyContent:"center"
    },
    tap:{
        flex:1,
        alignItems:"center",
        padding:16,
        borderBottomWidth:2,
        borderBottomColor:"#DDD",
    }
})