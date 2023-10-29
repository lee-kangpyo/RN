import { StyleSheet, Dimensions , Text, View } from 'react-native';

export default function WeekTotal({checkBox}) {
    const countOfOnes = [0,0,0,0,0,0,0];
    const countOfTwos = [0,0,0,0,0,0,0];
        
    for (let i = 0; i < checkBox.length; i++) {
        for (let j = 0; j < checkBox[i].length; j++) {
            if (checkBox[i][j] === 1) {
                countOfOnes[j]++;
            } else if (checkBox[i][j] === 2) {
                countOfTwos[j]++;
            }
        }
    }

    const halfCountOfOnes = countOfOnes.map((count) => (count / 2).toFixed(1));
    const halfCountOfTwos = countOfTwos.map((count) => (count / 2).toFixed(1));

    return(
        <View style={{flexDirection:"row"}}>
            <NameBox name={"합계"} />
        {
            [0, 1, 2, 3, 4, 5, 6].map((idx)=>{
                return(
                    <Box key={idx} top={halfCountOfOnes[idx]} bot={halfCountOfTwos[idx]}  />
                )
            })
        }
        </View>
    )
}

function Box({top, bot}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, width:boxWidth}}>
            <Text style={{fontSize:boxWidth*0.3,}}>{top}</Text>
            <Text style={{fontSize:boxWidth*0.2, color:"red"}}>({bot})</Text>
        </View>
    );
}

function NameBox({name}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, flex:1.45, width:boxWidth, justifyContent:"center"}}>
            <Text>{name}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{ flexDirection:"row",  },
    box:{
        flex:1,
        paddingVertical:5,
        margin:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    blank:{
        paddingVertical:15,
        margin:2,
        alignItems:"center",
    }
});
  