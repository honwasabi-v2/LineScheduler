const BULK_DATA_SHEET_URL = PropertiesService.getScriptProperties().getProperty('SheetsURL');; // 参照元スプレッドシート
function getValuesBySheetsApi(sheetId, request) {
　let values = Sheets.Spreadsheets
　　　　　　　　　　 .Values
　　　　　　　　　　 .batchGet(sheetId, request)
　　　　　　　　　　 .valueRanges; 
　let object = {};
　for (var i in values) {
　　let range = values[i]["range"].replace(/'/g, "");
　　object[range] = values[i]["values"];
　}
　return object;
}


function getBulkDataFromSingleSheetWithSheetsApi(sheet) {
　const sheetId = BULK_DATA_SHEET_URL.match(/\/([\w\-_]+)\/$/)[1]; //URLからIDを抽出.
　const request = {
　　ranges: sheet, 
　　majorDimension: "ROWS",
　}
　const data = getValuesBySheetsApi(sheetId, request);
  return data;
}

function setValueToSpreadsheetBySheetsApi(cell,text) {
　let sheetId =BULK_DATA_SHEET_URL.match(/\/([\w\-_]+)\/$/)[1];
　var resource = {
　　data: [
　　　{
　　　　values: [[text]], 
　　　　range: cell, 
　　　},
　　],
　　valueInputOption: "USER_ENTERED",
　}
　updateValuesBySheetsApi(sheetId, resource);
}

function updateValuesBySheetsApi(sheetId, resource) {
  Sheets.Spreadsheets.Values.batchUpdate(resource, sheetId);
}

function numToDate(num){
  const year = Math.trunc(num/100000000);
  const month = Math.trunc((num-year*100000000)/1000000);
  const day = Math.trunc((num-year*100000000-month*1000000)/10000);
  const hour = Math.trunc((num-year*100000000-month*1000000-day*10000)/100);
  const minutes = Math.trunc((num-year*100000000-month*1000000-day*10000-hour*100));

  return new Date(year,month-1,day,hour,minutes);
}
function dateToNum(date){
  let num = 0;
  num = date.getFullYear()*100000000+(date.getMonth()+1)*1000000+date.getDate()*10000+date.getHours()*100+date.getMinutes();
  return num;
}

function allSchedule(){
  const data = getBulkDataFromSingleSheetWithSheetsApi("シート1");
  const keyRange = Object.keys(data);
  data[keyRange[0]].shift()
  //console.log(data[keyRange[0]]);
  return data[keyRange[0]];
}
function getScheduleRange(){
  let schedules = allSchedule();
  return schedules.length;
}
function insertSchedule(date,event){
  let schedules = allSchedule();
  let count = getScheduleRange()-1; 
  console.log(count);
  console.log(schedules[count]);

  for(count;count >= 0;count--){
    console.log(schedules[count]);
    if(date > schedules[count][0]){
      console.log("data:"+date)
      console.log("schedule:"+schedules[count][0])
      setValueToSpreadsheetBySheetsApi("a"+(count+3),date);
      setValueToSpreadsheetBySheetsApi("b"+(count+3),event);
      setValueToSpreadsheetBySheetsApi("c"+(count+3),"");
      return;
    }else{
      setValueToSpreadsheetBySheetsApi("a"+(count+3),schedules[count][0]);
      setValueToSpreadsheetBySheetsApi("b"+(count+3),schedules[count][1]);
      setValueToSpreadsheetBySheetsApi("c"+(count+3),schedules[count][2]);
    }
    
  }
  console.log("minimum");
  setValueToSpreadsheetBySheetsApi("a2",date);
  setValueToSpreadsheetBySheetsApi("b2",event);
  setValueToSpreadsheetBySheetsApi("c2","");

}

function searchSchedule(text){
  const schedules = allSchedule();
  let count = 0; 
  let obj = -1;
  if (isFinite(text) && (text.length == 12) ){
    for(count;count <= getScheduleRange()-1 ;count++){
      //console.log(schedules[count]);
      if(text == schedules[count][0]){
        console.log("text:"+text)
        console.log(schedules[count]);
        obj = count;
        break;
      }
    }
  }else{
    for(count;count <= getScheduleRange()-1 ;count++){
      //console.log(schedules[count]);
      if(text == schedules[count][1]){
        console.log("text:"+text)
        console.log(schedules[count]);
        obj = count;
        break;
      }
    }
  }
  return obj;
}

function deleteSchedule(text){
  const index =  searchSchedule(text);
  if (index == -1){
    return -1;
  }
  const schedules =  allSchedule();
  const length = schedules.length;  
  if (length >= 900){
    sendMessege("もう少しでsheet2がいっぱいになります。\n"+length+"/1000 \n 対処をしてください。")
  }
  //BackUp to sheet2
  const data = getBulkDataFromSingleSheetWithSheetsApi("シート2")
  const keyRange = Object.keys(data);
  const n = data[keyRange[0]].length;

  setValueToSpreadsheetBySheetsApi("シート2!a"+(n+1),schedules[index][0]);
  setValueToSpreadsheetBySheetsApi("シート2!b"+(n+1),schedules[index][1]);
  setValueToSpreadsheetBySheetsApi("シート2!c"+(n+1),schedules[index][2]);

  for(let i = index;i < length-1;i++){
    setValueToSpreadsheetBySheetsApi("a"+(i+2),schedules[i+1][0]);
    setValueToSpreadsheetBySheetsApi("b"+(i+2),schedules[i+1][1]);
    if (schedules[i+1][2] != undefined){
      setValueToSpreadsheetBySheetsApi("c"+(i+2),schedules[i+1][2]);
    }else{
      setValueToSpreadsheetBySheetsApi("c"+(i+2),"");
    }
  }
  setValueToSpreadsheetBySheetsApi("a"+(length+1),"");
  setValueToSpreadsheetBySheetsApi("b"+(length+1),"");
  setValueToSpreadsheetBySheetsApi("c"+(length+1),"");

  return schedules[index];
}
