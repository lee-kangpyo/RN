import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomModal = ({ visible, title, body, confBtnTxt, confirm, cBtnTxt, onCancel, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.LayerPopup}>
          <Text style={styles.title}>{title}</Text>
          {body}
          <View style={styles.btnGroup}>
            <TouchableOpacity style={{alignItems:"flex-end", marginRight:8}} onPress={onCancel}>
                <Text style={{color:"blue", fontSize:16}}>{cBtnTxt}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems:"flex-end"}} onPress={confirm}>
                <Text style={{color:"blue", fontSize:16}}>{confBtnTxt}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  LayerPopup: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    padding: 16,
  },
  title:{
    fontSize:18
  },
  btnGroup:{
    flexDirection:"row",
    justifyContent:"flex-end"
  }
});

export default CustomModal;
