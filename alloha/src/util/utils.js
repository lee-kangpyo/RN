import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export const addComma = (number) => {
    const convertedNumber = number || 0;
    return convertedNumber.toLocaleString();
}

export const safeToLocaleString = (value, defaultValue) => {
    // 기본 값 설정
    const defaultVal = typeof defaultValue === 'number' ? defaultValue : 0;

    // 숫자 값을 포맷하기 위한 함수
    const formatNumber = (num) => {
        // 콤마 제거 후 숫자로 변환
        const cleanedNumber = parseFloat(num.toString().replace(/,/g, ''));
        // 숫자가 아니면 기본 값으로 대체
        return isNaN(cleanedNumber) ? defaultVal.toLocaleString() : cleanedNumber.toLocaleString();
    };

    // 입력 값이 유효한 숫자인지 확인
    // 문자열과 숫자 모두 처리
    if (typeof value === 'number' || typeof value === 'string') {
        return formatNumber(value);
    } else {
        // 기본 값으로 대체
        return formatNumber(defaultVal);
    }
};

export const headerTitleStyle = {
    fontFamily: "SUIT-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    
}
export const headerLeftNon = () => {
    const navigation = useNavigation();
    return (
        <View />
    )
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