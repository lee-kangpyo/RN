import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx-js-style';
import { theme } from '../../util/color';
const { StorageAccessFramework } = FileSystem;

export default function Excel({header, type="sharing", custom, btntext, data, fileName }) {
  // 엑셀 공유
  const execlSharing = async () => {
    const date = new Date()
    
    const wbout = makeExcelData();
    const fileNa = `${fileName}_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.xlsx`;
    const uri = FileSystem.cacheDirectory + fileNa;
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    await Sharing.shareAsync(uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'MyWater data',
      UTI: 'com.microsoft.excel.xlsx'
    });
  };
  

  // 엑셀 다운.
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
    var ws = XLSX.utils.json_to_sheet(data, { skipHeader: !header, });
    if(custom == "profit"){
      ws = _profit(ws)
    }else if(custom == "result") {
      ws = _result(ws)
    }
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, {
      type: 'base64',
      bookType: "xlsx"
    });
    return wbout;
  }
  // 매출 현황 디자인
  const _border = {
    basic:{
      top: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
    },
    bottom_thick:{
      top: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thick', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
    }
  }
  const _profit = (ws) => {
    ws["!cols"] = [];
    for (var i = 0; i < data.length; i++) {
      ws["!cols"].push({ wpx: 100 });
      const item = Object.values(data[i]);
      const row = i + 1;
      // // 병합 시작 행을 찾음
      // if (item[0] && item[0]["구분"] !== "") {
      //   mergeStartRow = row;
      // }

      for (var j = 0; j < item.length; j++) {
        if (j >= 26) break;
        const col = String.fromCharCode(65 + j);
        const cell = ws[`${col}${row}`]
        if (col == "C") {
          cell.z = '#,##0'; // 열 "C"에 대한 서식
          cell.s = {border: _border.basic,};
        } else {
          cell.s = {
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: _border.basic,
          };
        }
      }
      // // 다음 행의 구분이 없을 경우, 현재 행과 다음 행을 병합
      // if (mergeStartRow !== -1 && (i === data.length - 1 || !item[0] || item[0]["구분"] === "")) {
      //   const mergeEndRow = i + 1;
      //   ws[`A${mergeStartRow}:A${mergeEndRow}`].s = { border: _border.basic };
      //   mergeStartRow = -1; // 초기화
      // }
    }
    
    // 셀병합
    // 병합할 시작 행 인덱스
    let startRow = 1;

    // 마지막 행 번호 계산
    const lastRow = ws['!ref'].split(':').pop(); // 마지막 행 얻기
    const lastRowIndex = parseInt(lastRow.substring(1), 10); // 행 번호 추출

    // 병합 정보를 저장할 배열
    let merges = [];

    // A1부터 시작하여 비어있지 않은 셀을 찾아 병합
    for (let row = 1; row <= lastRowIndex; row++) {
      const cell = ws[`A${row}`];

      console.log(`DEBUG: Checking row ${row}, cell value:`, cell ? cell.v : null);

      if (cell && cell.v) {
        // 현재 셀이 비어있지 않은 경우
        if (startRow !== row) {
          console.log(`DEBUG: Merging rows ${startRow-1} to ${row - 1}`);
          // 병합된 셀의 정보를 merges 배열에 추가
          merges.push({ s: { r: startRow - 2, c: 0 }, e: { r: row - 2, c: 0 } });
        }
        startRow = row + 1; // 시작 행을 현재 행 다음으로 설정
      }
    }

    // 마지막으로 남은 부분도 처리
    if (startRow <= lastRowIndex) {
      console.log(`DEBUG: Merging rows ${startRow} to ${lastRowIndex}`);
      // 병합된 셀의 정보를 merges 배열에 추가
      merges.push({ s: { r: startRow - 2, c: 0 }, e: { r: lastRowIndex - 1, c: 0 } });
    }
    ws['!merges'] = merges;

    return ws;
  }
  // 결과 현황 디자인
  const _result = (ws) => {
    ws["!cols"] = [
      { wpx : 100 }, 
      { wpx : 100 }, 
      { wpx : 100 }, 
      { wpx : 30 },
      { wpx : 30 },
      { wpx : 30 },
      { wpx : 30 },
      { wpx : 30 },
      { wpx : 30 },
      { wpx : 30 },
      { wpx : 100 }, //작업시간(합계)
      { wpx : 100 }, //시급
      { wpx : 100 }, 
      { wpx : 100 },
      { wpx : 100 }, 
      { wpx : 100 }, 
      { wpx : 100 },
      { wpx : 100 },
    ];
    for (var i = 0; i < data.length; i++) {
      el = data[i];
      const item = Object.values(data[i]);
      const row = i + 2;
      for (var j = 0; j < item.length; j++) {
        if (j >= 26) break;
        const col = String.fromCharCode(65 + j);
        // 헤더
        if(i == 0){
          ws[`${col}1`].s = {
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: _border.basic,
          };
        }
        if (col == "L" || col == "Q") {
          ws[`${col}${row}`].z = '#,##0';
          ws[`${col}${row}`].s = {
            alignment : { horizontal: 'right', vertical: 'middle' },
          }
        }
        
        if(el.주차 == "소계" || el.주차 == "총계" ){
          ws[`${col}${row}`].s = {
            border : _border.bottom_thick,
            font: {
              color: { rgb: (el.주차 == "소계")?'#3C7BB9':'#508D69' },
            },
          }
        }
      }
    }
    return ws;
  }

  const saveStorage = async (uri, fileName, excelData) => {
    return await StorageAccessFramework.createFileAsync(uri, fileName, 'application/xlsx')
    .then(async (uri) => {
      await FileSystem.writeAsStringAsync(uri, excelData, { encoding: FileSystem.EncodingType.Base64 });
      alert('다운로드가 완료되었습니다.')
    })
  }
  const getPermission = async () => {
    const path = StorageAccessFramework.getUriForDirectoryInRoot("Download");
    const result = await StorageAccessFramework.requestDirectoryPermissionsAsync(path);
    return result;
  }


  const onPress = (type == "sharing")?execlSharing:(type == "download")?execlDownLoad:null;

  return (
    <View>
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btntext}>{btntext}</Text>
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
    btn:{
      borderColor:theme.link,
      fontSize:8,
      borderWidth:1,
      borderRadius:5,
      paddingHorizontal:5,
      paddingVertical:2
    },
    btntext:{
      color:theme.link
    }
  });