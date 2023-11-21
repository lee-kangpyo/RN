import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
const { StorageAccessFramework } = FileSystem;

export default function Excel({type="sharing", btntext, data, fileName }) {
  // 엑셀 공유
  const execlSharing = async () => {
    const wbout = makeExcelData();
    const fileNa = fileName+'.xlsx';
    const uri = FileSystem.cacheDirectory + fileNa;
    console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    await Sharing.shareAsync(uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'MyWater data',
      UTI: 'com.microsoft.excel.xlsx'
    });
  };
  
  // 엑셀 다운 
  // 1. 유저가 지정한 디렉토리 경로 저장 작업필요
  // 2. 디렉토리 경로 불러오는 작업 필요
  // 3. 
  const execlDownLoad = async () => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    excelData = makeExcelData();
    const fileNa = fileName+'_'+timestamp+'.xlsx';

    // 여기서 디렉토리 경로 가져오기 없으면 ""
    directoryUri = "";
    
    if(directoryUri == ""){
      // A. 처음 저장할때.
      const permissions = await getPermission();
      if (!permissions.granted) {
        alert("디렉토리 권한 요청이 거부 되었습니다.");
        return;
      }
      directoryUri = permissions.directoryUri;
    }

    try {
      await saveStorage(directoryUri, fileNa, excelData)
        .catch(async (e) => {
          console.log(e);
          const permissions = await getPermission();
          if (!permissions.granted) {
            alert("디렉토리 권한 요청이 거부 되었습니다.");
            return;
          }

          saveStorage(permissions.directoryUri, fileNa, excelData)
          .catch((e) => {
            alert("엑셀 저장 중 알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
          });

        });
    } catch (e) {
      alert("엑셀 저장 중 알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      //throw new Error(e);
    }
  };
  const makeExcelData = () => {
    var ws = XLSX.utils.json_to_sheet(data, { header: false });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, {
      type: 'base64',
      bookType: "xlsx"
    });
    return wbout;
  }
  const saveStorage = async (uri, fileName, excelData) => {
    return await StorageAccessFramework.createFileAsync(uri, fileName, 'application/xlsx')
    .then(async (uri) => {
      await FileSystem.writeAsStringAsync(uri, excelData, { encoding: FileSystem.EncodingType.Base64 });
      alert('다운로드가 완료되었습니다.')
    })
  }
  const getPermission = async () => {
    console.log("getPermission");
    const path = StorageAccessFramework.getUriForDirectoryInRoot("Download");
    const result = await StorageAccessFramework.requestDirectoryPermissionsAsync(path);
    return result;
  }


  const onPress = (type == "sharing")?execlSharing:(type == "download")?execlDownLoad:null;

  return (
    <View>
        <TouchableOpacity onPress={onPress}>
            <Text>{btntext}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });