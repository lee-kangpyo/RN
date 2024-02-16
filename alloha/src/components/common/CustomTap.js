
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { theme } from '../../util/color';

// 사용 예시 > 아래 처럼 셋팅후 screen 에서 selectedKey를 가지고 렌더링 하면됨
// const [selectedKey, setSelectedKey] = useState(0);
// <CustomTap data={[{key:0, name:"전체보기"}, {key:1, name:"이슈보기"}]} selectedKey={selectedKey} setSelectedKey={setSelectedKey}/>
export default function CustomTap({data, selectedKey, setSelectedKey}) {
    const Tap = ({item, selectedKey, onPressed, }) => {
        const cnt = (item.cnt > 99)?"99+":item.cnt;
        const isSelected = selectedKey == item.key;
        return(
            <TouchableOpacity style={[styles.tapBtn, styles.row, (isSelected)?styles.tapActive:null]} onPress={()=>onPressed(item.key)}>
                <Text style={[styles.tapText, (isSelected)?styles.tapActiveText:null]}>{item.name}</Text>
                {
                    (cnt)?
                        <View style={styles.pill}>
                            <Text style={[styles.tapText, (isSelected)?styles.tapActiveText:null, {fontSize:10, fontWeight:"bold"}]}>{cnt}</Text>
                        </View>
                    :
                        null
                }
                
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.tapBox}>
            {
                data.map((el, idx)=><Tap key={idx} item={el} selectedKey={selectedKey} onPressed={setSelectedKey} />)
            }
        </View>
    );
}


const styles = StyleSheet.create({
    tapBox:{backgroundColor:"#4D4D4D", width:"100%", flexDirection:"row", padding:10, paddingBottom:0, overflow:"hidden", borderTopEndRadius:15, borderTopStartRadius:10,},
    tapBtn:{paddingVertical:10, paddingHorizontal:20, marginRight:5, borderTopEndRadius:15, borderTopStartRadius:15, backgroundColor:"#7C7C7C"},
    tapActive:{backgroundColor:theme.backGround},
    tapText:{color:theme.backGround, fontWeight:"bold"},
    tapActiveText:{color:"#4D4D4D"},
    row:{flexDirection:"row"},
    pill:{ width:22, height:22, backgroundColor:"red", padding:0, borderRadius:20, justifyContent:"center", alignItems:"center", marginLeft:10},
});