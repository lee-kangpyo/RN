import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx-js-style';
import { theme } from '../../util/color';
const { StorageAccessFramework } = FileSystem;

export default function Excel({header = true, type="sharing", custom, btntext, data, fileName }) {
  // 엑셀 공유
  const execlSharing = async () => {
    const date = new Date()
    const wbout = makeExcelData();
    const fileNa = `${fileName}_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.xlsx`;
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
  

  // 엑셀 다운 지금은 안씀. 공유사용하기.
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
    if(custom == "profit"){
      var ws = XLSX.utils.json_to_sheet(data, { skipHeader: !header, });
      ws = _profit(ws)
    }else if(custom == "result") {
      // 추가 헤더 셋팅
      var Heading = [["근무자", "주간별근무시간", "", "", "", "", "", "", "", "", "", "", "주휴", "", "", "", "근무현황", "", "", "", "", "", ""],]; 
      var ws = XLSX.utils.json_to_sheet(data, { origin: 'A2' });
      XLSX.utils.sheet_add_aoa(ws, Heading); //heading: array of arrays
      ws = _result(ws)
    } else{
      var ws = XLSX.utils.json_to_sheet(data, { skipHeader: !header, });
    }
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const wbout = XLSX.write(wb, {
      type: 'base64',
      bookType: "xlsx"
    });
    return wbout;
  }

  const _profit = (ws) => {
  //inner function
    const _cellstyle = (cell, style, format) => {
      cell.s = style;
      if(format) cell.z = format;
    };
    const merging = (ws) => {
      // 셀병합 시작
      let startRow = 1;                                                                   // 병합할 시작 행 인덱스
      const lastRow = ws['!ref'].split(':').pop();                                        // 마지막 행 구하기
      const lastRowIndex = parseInt(lastRow.substring(1), 10);                            // 마지막 행 인덱스
      let merges = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 3 } }];                            // 병합 정보를 저장할 배열

      // A1 시작해서 다음 비어있지 않은 셀을 찾은 후 그전까지 행을 병합하는 코드를 merges에 push
      // ex A1:값있음 A2:값없음 A3:값없음 A4:값있음 -> startRow는 A2까지 커서 이동 A4까지 row 커서이동 후 A1 부터 A3까지 병합
      for (let row = 1; row <= lastRowIndex; row++) {
        const cell = ws[`A${row}`];
        // console.log(`DEBUG: Checking row ${row}, cell value:`, cell ? cell.v : null);
        if (cell && cell.v) {                                                             // 현재 셀이 비어있지 않은 경우
          if (startRow !== row) {
            //console.log(`DEBUG: Merging rows ${startRow-2} to ${row - 2}`);
            merges.push({ s: { r: startRow - 2, c: 0 }, e: { r: row - 2, c: 0 } });       // 병합된 셀의 정보를 merges 배열에 추가
          }
          startRow = row + 1;                                                             // 시작 행을 현재 행 다음으로 설정
        }
      }
      if (startRow <= lastRowIndex) {                                                     // 마지막이 값 없음으로 끝난다면 추가 병합 코드
        //console.log(`DEBUG: Merging rows ${startRow} to ${lastRowIndex}`);
        merges.push({ s: { r: startRow - 1, c: 0 }, e: { r: lastRowIndex - 1, c: 0 } });
      }
      ws['!merges'] = merges;
    }
  //inner function
    ws["!cols"] = [];
    for (var i = 0, len = data.length; i < len; i++) {
      ws["!cols"].push({ wpx: 100 });                 // width 설정
      const item = Object.values(data[i]);
      const row = i + 1;
      let colorStyle = {fgColor: { rgb: null }, patternType: 'solid'};

      for (var j = 0; j < item.length; j++) {
        if (j >= 26) break; // A-Z 열까지만 적용
        const col = String.fromCharCode(65 + j), cell = ws[`${col}${row}`];
        if(col == "B" && cell.v == "계")colorStyle = {fill: {fgColor: { rgb: 'FFCC00' }, patternType: 'solid'}};
        const lastCell = (row == len)?ws[`${col}${row+1}`]:null;
        if (col == "C") {
          const style = {border: _border.basic,};
          _cellstyle(cell, {...style, ...colorStyle}, "#,##0");
          if (lastCell) _cellstyle(lastCell, {...style, fill: { fgColor: { rgb: 'FFCC00' }, patternType: 'solid'}}, "#,##0");
        }else if(col == "D"){
          const style = {alignment: { horizontal: 'right', vertical: 'middle' }, border: _border.basic,};
          _cellstyle(cell, {...style, ...colorStyle}, "#,##0");
          if (lastCell) _cellstyle(lastCell, {...style, fill: { fgColor: { rgb: 'FFCC00' }, patternType: 'solid'}}, "#,##0");
        } else {
          const style = { alignment: { horizontal: 'center', vertical: 'middle' }, border: _border.basic, };
          _cellstyle(cell, {...style, ...colorStyle});
          if(lastCell) _cellstyle(lastCell, {...style, fill: { fgColor: { rgb: 'FFCC00' }, patternType: 'solid'}});
        }
      }
    }
    merging(ws);
    return ws;
  }

  // 결과 현황 디자인
  const _result = (ws) => {
    //헤더 병합
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 11 } },  // 주간별근무시간
      { s: { r: 0, c: 12 }, e: { r: 0, c: 14 } },  // 주휴
      { s: { r: 0, c: 16 }, e: { r: 0, c: 21 } },  // G1:H1
    ];
    // 열 너비 설정
    ws["!cols"] = [ { wpx : 100 }, { wpx : 30 }, { wpx : 100 }, { wpx : 30 }, { wpx : 30 },
                    { wpx : 30 }, { wpx : 30 }, { wpx : 30 }, { wpx : 30 }, { wpx : 30 },
                    { wpx : 50 }, { wpx : 100 }, { wpx : 50 }, { wpx : 50 }, { wpx : 100 }, 
                    { wpx : 100 }, { wpx : 50 }, { wpx : 50 }, { wpx : 80 }, { wpx : 50 }, 
                    { wpx : 50 } ];
    // 하나의 행을 뽑는다.
    for (var i = 0; i < data.length; i++) {
      el = data[i];
      const item = Object.values(data[i]);
      const row = i + 3;
      for (var j = 0; j < item.length; j++) {   // 한개 셀을 선택
        if (j >= 26) break;
        const col = String.fromCharCode(65 + j);

        if (["L", "O", "P"].includes(col)) {
          ws[`${col}${row}`].z = '#,##0';
          ws[`${col}${row}`].s = {
            alignment : { horizontal: 'right', vertical: 'middle' },
            border: _border.basic,
          }
        }else if(["B", "C", "D", "E", "F", "G", "H", "I", "J", "U"].includes(col)){
          ws[`${col}${row}`].s = {
            alignment : { horizontal: 'center', vertical: 'middle' },
            border: _border.basic,
          }
        }else{
          ws[`${col}${row}`].s = {
            alignment : { horizontal: 'center', vertical: 'middle' },
            border: _border.basic,
          }
        }

        let existingStyle = ws[`${col}${row}`].s || {};

        if(el.주차 == "소계" || el.주차 == "총계" ){
          ws[`${col}${row}`].s = {
            ...existingStyle,
            border : _border.bottom_thick,
            font: {
              color: { rgb: (el.주차 == "소계")?'#3C7BB9':'#508D69' },
            },
          }
        }

        // 헤더
        if(i == 0){
          ws[`${col}2`].s = {
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: _border.basic,
          };
          ws[`${col}1`].s = {
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: _border.basic,
          };
        }
      }
    }
    return ws;
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