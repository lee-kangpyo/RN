import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';


/** 
 * 1. 부모 컴포넌트에서 하단의 예제 코드를 참조해서 추가하면됨.
 * 
 * const [hpNo, setHpno] = useState();
 * 
 * <CustomInput placeholderText={"휴대전화 번호 입력"} setInputValue={setHpno}/>\n
 * 
 * 2. 아이콘 사용 하기 예제코드
 * 
 * <CustomInput placeholderText={"휴대전화 번호 입력"} setInputValue={setHpno} iconComponent={<Image source={require('../../assets/icons/Lock.png')} style={{width:30, height:30}} />}/>
 */

export default function CustomInput ({placeholderText = "", iconComponent, value, setInputValue, keyboardType='default'}){
    const inputRef = useRef(null);
    const [text, setText] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    const onChangeText = (text) => {
        setText(text);
        setInputValue(text);
    }

    // 애니메이션 부분
    const topAnim = useRef(new Animated.Value(15)).current;
    const paddingHorizontalAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.parallel([
          Animated.timing(topAnim, {
            toValue: text.length > 0 || isFocused ? -8 : 15,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(paddingHorizontalAnim, {
            toValue: placeholderText == '' ? 0 : text.length > 0 ||  isFocused ? 8 : 0,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start();
      }, [isFocused]);
    
    return(
        <TouchableOpacity onPress={()=>inputRef.current.focus()} style={styles.inputContainer} activeOpacity={1}>
            <TextInput
                ref={inputRef}
                style={[styles.input, fonts.inputLabel]}
                onChangeText={(value) => onChangeText(value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={text}
                keyboardType={keyboardType}
            />
            <Animated.Text style={[fonts.inputLabel, {position:"absolute", left:16, backgroundColor:"white",top: topAnim, paddingHorizontal: paddingHorizontalAnim,}]}>{placeholderText}</Animated.Text>
            {
                iconComponent
            }
        </TouchableOpacity>
    )
}

const fonts = StyleSheet.create({
    inputLabel:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#999999"
    },
})

const styles = StyleSheet.create({
    container:{ flex: 1, padding:16, backgroundColor:"#fff"},
    inputContainer:{
        flexDirection:"row",
        alignItems:"center",
        padding:15,
        marginBottom:10,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
    },
    input: {
        flex:1,
    },
    inputIcon:{
        width:18,
        height:18,
    },
});