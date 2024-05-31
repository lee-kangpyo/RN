import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';



const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    callBack:"",
    confirm: false,
    confirmText:"확인",
    onConfirm: null,
    cancelText:"취소",
    onCancel: null,
  });
  const scaleValue = useRef(new Animated.Value(0)).current;


  function showAlert (title, message, {callBack}={}) {
    setAlertConfig({ visible: true, title, message, confirm: false, callBack });
  };

  const showConfirm = (title, message, onConfirm, {confirmText="확인", cancelText="취소", onCancel} = {}) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      confirm: true,
      confirmText,
      onConfirm,
      cancelText,
      onCancel,
    });
  };

  const closeAlert = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setAlertConfig({ ...alertConfig, visible: false });
    });
  };

  const handleOk = () => {
    if(alertConfig.callBack) alertConfig.callBack();
    closeAlert()
  }

  const handleConfirm = () => {
    if (alertConfig.onConfirm) alertConfig.onConfirm();
    closeAlert();
  };

  const handleCancel = () => {
    if (alertConfig.onCancel) alertConfig.onCancel();
    closeAlert();
  };

  useEffect(() => {
    if (alertConfig.visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [alertConfig.visible]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Modal
        transparent={true}
        visible={alertConfig.visible}
        animationType="none"
        onRequestClose={closeAlert}
      >
        <View style={styles.overlay}>
          <Animated.View style={[styles.alertBox, { transform: [{ scale: scaleValue }] }]}>
            <Text style={styles.title}>{alertConfig.title}</Text>
            <Text style={styles.message}>{alertConfig.message}</Text>
            {alertConfig.confirm ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                  <Text style={styles.buttonText}>{alertConfig.confirmText}</Text>
                </TouchableOpacity>
                <View style={{width:8}} />
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                  <Text style={styles.buttonText}>{alertConfig.cancelText}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleOk}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

/**
 * 사용법
 *  
 * 1. 컴포넌트에 hook을 선언
 * 
 * const { showAlert, showConfirm} = useAlert();
 * 
 * 2. showAlert
 * 
 * showAlert(title, message, {callBack})
 * 
 * 3. showConfirm
 * 
 * showConfirm = (title, message, {confirmText, onConfirm, cancelText, onCancel})
 */
export const useAlert = () => {
  return useContext(AlertContext);
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    alignSelf:"flex-start",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    alignSelf:"flex-end",
  },
  buttonText: {
    color: '#3479EF',
    fontSize: 16,
  },
  buttonContainer: {
    alignSelf:"flex-end",
    flexDirection: 'row',
  },
});


