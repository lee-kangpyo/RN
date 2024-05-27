

import { StyleSheet, Text, View, Image } from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomTap from '../components/common/CustomTap';

export default function FindIdPwScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"비밀번호 변경"})
    }, [navigation])

    const [tapList, setStoreList] = useState([]);

    return (
        <>
        <Tap tapList={tapList} selectTapNo={0}/>  
        <View style={styles.container}>

            <Text>비밀번호 변경탭</Text>
        </View>
        </>
    );
}

const Tap = ({tapList, selectTapNo}) =>{
    {
        (tapList.length > 0)?
        <View style={{backgroundColor:"#fff"}}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal = {true} >
                {tapList.map((tapNa, idx) => {
                    var borderBlockColor = "#fff";
                    if(idx == selectTapNo){
                        borderBlockColor = "#3479EF";
                    }
                    return(
                        <TouchableOpacity key={idx} onPress={()=>{}} style={[styles.tap, { width: tapWidth, borderBlockColor:(item.CSTCO == selectCstCo)?"#3479EF":"#fff"}]}>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={(item.CSTCO == selectCstCo)?fonts.tapText_selected:fonts.tapText}>{tapNa}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
        :
        null
    }

}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    sampleImage:{width:"100%", height:"100%"}
});