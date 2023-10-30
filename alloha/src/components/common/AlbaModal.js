import { useNavigation } from "@react-navigation/native";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

export function AlbaModal({execptAlbaId, isShow, onClose, onShow, addAlba, selectAlba }){
    const albaList = useSelector((state)=>state.schedule.albaList);
    console.log(execptAlbaId);
    console.log(albaList);
    const filterList = albaList.filter((el)=>execptAlbaId.indexOf(el.USERID) == -1)
    
    const User = ({alba}) => {
        return (
            <TouchableOpacity onPress={()=>selectAlba(alba)}>
                <View style={styles.user}>
                    <Text>{alba.USERNA}</Text>
                    <Ionicons name="chevron-forward" size={16} color="black" />
                </View>
            </TouchableOpacity>
        );
    }

    return(
        <CustomModal isShow={isShow} onClose={onClose} onShow={onShow}>
            <View style={{flex:5, padding:15, width:"100%", }}>
                <Text style={styles.title}>알바 선택</Text>
                <ScrollView>
                    {
                        filterList.map((el, idx)=>{
                            return <User key={idx} alba={el} />
                        })
                    }
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity onPress={addAlba}>
                    <View style={styles.btnMini}>
                        <Text style={{color:"black"}}>알바 등록</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </CustomModal>
    )
}


function CustomModal({onShow, isShow, onClose, children }){
    return (
        <Modal 
            style={{backgroundColor:"black"}}
            animationType={"fade"}  
            visible={isShow} 
            transparent={true}
            onShow={onShow}
        >
            <View style={{ width:"100%", height:"100%", backgroundColor:"rgba(0,0,0,0.5)", padding:50  }}>
                <View style={{backgroundColor:"white", flex:1, justifyContent:"center", alignItems:"center", borderWidth:1, borderColor:"black", borderRadius:10}}>
                    {children}
                    <View style={{flex:1}}>
                        <TouchableOpacity style={styles.btn} onPress={()=>onClose()}>
                            <Text>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    card:{
        flex:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
    },
    sampleImage:{width:"100%", height:"100%"},
    box:{
        backgroundColor:"#D7E5CA",
        paddingVertical:10,
        margin:1,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    btn:{
        marginTop:20,
        backgroundColor:"#D8B4F8", 
        paddingHorizontal:100,
        paddingVertical:15, 
        borderRadius: 10, // 테두리 모서리 둥글게 
        alignSelf:"center",
    },
    btnMini:{borderWidth:1, borderColor:"grey", borderRadius:5, padding:5,},
    title:{alignSelf:"center", fontSize:20, marginBottom:15},
    user:{
        marginBottom:5,
        justifyContent:"space-between",
        flexDirection:"row",
        padding:20,
        borderWidth:0.5,
        borderColor:"gray",
        backgroundColor:"#FAF1E4",
    }
});