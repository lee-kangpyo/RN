
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { theme } from '../../util/color';

// 사용 예시 > 아래 처럼 셋팅후 screen 에서 selectedKey를 가지고 렌더링 하면됨
// const [selectedKey, setSelectedKey] = useState(0);
// <CustomTap data={[{key:0, name:"전체보기"}, {key:1, name:"이슈보기"}]} selectedKey={selectedKey} setSelectedKey={setSelectedKey}/>
export default function CustomTap({data, selectedKey, setSelectedKey}) {
    const Tap = ({item, selectedKey, onPressed, }) => {
        const cnt = (item.cnt > 99)?"99+":item.cnt;
        //const cnt = "99+";
        const isSelected = selectedKey == item.key;
        return(
            <TouchableOpacity style={[styles.tapBtn, styles.row, (isSelected)?styles.tapActive:null]} onPress={()=>onPressed(item.key)}>
                <View style={styles.textContainer}>
                    <Text style={[(isSelected)?fonts.activeText:fonts.deActiveText]}>{item.name}</Text>
                </View>
                {
                    (cnt)?
                        <View style={styles.pill}>
                            <Text style={[fonts.badgeText]}>{cnt}</Text>
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

const fonts = StyleSheet.create({
    deActiveText:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        color: "#999999"
    },
    activeText:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#3479EF"
    },
    badgeText:{
        fontFamily: "SUIT-Bold",
        fontSize: 11,
        color: "#FFFFFF"
    }
})

const styles = StyleSheet.create({
    tapBox:{ flexDirection:"row", backgroundColor:"white", width:"100%", justifyContent:"center"},
    tapBtn:{padding:10, flex:1, justifyContent:"center"},
    tapActive:{borderBottomColor:"#3479EF", borderBottomWidth:1},
    tapText:{fontWeight:"bold"},
    tapActiveText:{color:"#4D4D4D"},
    row:{flexDirection:"row"},
    textContainer:{height:24, justifyContent:"center"},
    pill:{ width:24, height:24, backgroundColor:"#3479EF", padding:0, borderRadius:20, justifyContent:"center", alignItems:"center", marginLeft:10},
});