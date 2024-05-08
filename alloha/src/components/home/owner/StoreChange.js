
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

export default function StoreChange({curStore, storeList, onChangeBtnTap}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (
        <>
        <View style={styles.storeNa}>
            <View style={{flex:1, paddingRight:5}}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={fonts.title}>{curStore.CSTNA}</Text>
            </View>
            {
                (storeList.length > 1)?
                <View style={{justifyContent:"center",}}>
                    <TouchableOpacity onPress={()=>setIsModalVisible(true)} style={styles.storeChangeBtn}>
                        <Text style={fonts.btnText}>변경</Text>
                    </TouchableOpacity>
                </View>
                :null
            }
            
        </View>
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(false);
            }}
        >
            <View style={modal.modalContainer}>
                <ScrollView style={{width:"90%", backgroundColor: 'white', borderRadius:10, maxHeight:150}} contentContainerStyle={modal.modalContent}>
                    {/* 모달 내용 */}
                    {
                        storeList.map((el, idx)=>{
                            return (
                                    <TouchableOpacity key={idx} style={modal.item} onPress={()=>{
                                        setIsModalVisible(false)
                                        onChangeBtnTap(el.CSTCO);
                                    }}>
                                        <Text key={idx} label={el.CSTNA} value={el.CSTCO} style={styles.pickerText}>{el.CSTNA}</Text>
                                    </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </Modal>
        </>
    );
}

const modal = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    touchableText: {
      fontSize: 18,
      color: 'blue',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent 회색 배경
    },

    modalContent: {
      padding: 20,
      borderRadius: 10,
    },
    item:{
        width:"100%",
        paddingVertical:15,
        paddingHorizontal:10,
    },
    closeButton: {
      marginTop: 10,
      color: 'blue',
    },
  });

const fonts = StyleSheet.create({
    title:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        color: "#333333",
        
    },
    btnText:{
        fontFamily: "SUIT-Regular",
        fontSize: 14,
        color: "#777",
    },
})
const styles = StyleSheet.create({
    storeNa:{
        paddingHorizontal:8,
        paddingVertical:16,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    storeChangeBtn:{
        padding:4,
        borderWidth:1,
        borderColor:"#777",
        borderRadius:8,
    }
});