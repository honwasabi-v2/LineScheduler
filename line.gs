//replyメッセージ.
function doPost(e) {
  //チャネルアクセストークン.
  const token = PropertiesService.getScriptProperties().getProperty('Token');

  const eventData = JSON.parse(e.postData.contents).events[0];
  const replyToken = eventData.replyToken;
  const messageType = eventData.message.type;
  const userMessage = eventData.message.text;
  let replyMessage = "";

  const url = 'https://api.line.me/v2/bot/message/reply';
  if (userMessage == "すべて"){
    replyMessage = all(); 
  }else if (userMessage == "今日"){
    replyMessage = today();
  }else if (userMessage == "URL"){
    replyMessage = retURL();
  }else if(userMessage.slice(0,3) == "登録:"){
    replyMessage = setSchedule(userMessage);
  }else if (userMessage.slice(0,3) == "消去:"){
    replyMessage = cancelSchedule(userMessage);
  }else {
    replyMessage = another(userMessage);
  }
  //ペイロード.
  const payload = {
    'replyToken': replyToken,
    'messages': [{
        'type': 'text',
        'text': replyMessage
      }]
  };
  //POSTパラメータ.
  const options = {
    'payload' : JSON.stringify(payload),
    'myamethod'  : 'POST',
    'headers' : {"Authorization" : "Bearer " + token},
    'contentType' : 'application/json'
  };
  UrlFetchApp.fetch(url, options);
}

//pushメッセージ.
function sendMessege(text){
  //チャネルアクセストークン.
  const token = PropertiesService.getScriptProperties().getProperty('Token');
  //UserID.
  const Id = PropertiesService.getScriptProperties().getProperty('Id');

  const url = 'https://api.line.me/v2/bot/message/push';

  //ペイロード.
  const payload = {
    'to': Id,
    'messages': [{
        'type': 'text',
        'text': text
      }]
  };
  //POSTパラメータ.
  const options = {
    'payload' : JSON.stringify(payload),
    'myamethod'  : 'POST',
    'headers' : {"Authorization" : "Bearer " + token},
    'contentType' : 'application/json'
  };

  UrlFetchApp.fetch(url, options);
}

function all(){ //if called all ,return all schedule.
  let text = "";
  const schedules = allSchedule();
  for(let schedule of schedules){
    let date = numToDate(schedule[0]);
    text += Utilities.formatDate(date, 'JST', 'MM/dd HH:mm')+" "+schedule[1]+"\n";

  }
  return text;
}

function today(){ //if called today,return todays schedule.
  let text = "";
  let today = new Date;
  let schedules = allSchedule();
  for(let schedule of schedules){
    let date= numToDate(schedule[0]);  
    if(date.getFullYear() == today.getFullYear()){
      if(date.getMonth() == today.getMonth()){
        if(date.getDate() == today.getDate()){
          text += Utilities.formatDate(date, 'JST', 'HH:mm')+" "+schedule[1]+"\n";
        }
      }
    }
  }
  return text;
}
function setSchedule(text){ //if called set,return success message or template of set.
  let time = new Date;
  const today = dateToNum(time);
  let replyMessage = "";
  let flag = true;
  if(isFinite(text.slice(3,15))&&text[15] == ":"){
    if(1000 <= text.slice(3,7)&&text.slice(3,7) <= 3000){
      time.setFullYear(text.slice(3,7));
    }else{
      flag = false;
    }
    if(1 <= text.slice(7,9)&&text.slice(7,9) <= 12){
      time.setMonth(text.slice(7,9)-1);
    }else{
      flag = false;
    }
    if(0 <= text.slice(9,11)&&text.slice(9,11) <= 31){
      time.setDate(text.slice(9,11));
    }else{
      flag = false;
    }
    if(0 <= text.slice(11,13)&&text.slice(11,13) <= 24){
      time.setHours(text.slice(11,13));
    }else{
      flag = false;
    }
    if(0 <= text.slice(13,15)&&text.slice(13,15) <= 60){
      time.setMinutes(text.slice(13,15));
    }else{
      flag = false;
    }
    if((text.slice(3,15) - today) < 200){
      replyMessage = "現在時刻＋2h以降の予定のみ受け付けます\n現在時刻:"+today;
      return replyMessage;
    }
  }else{
    flag = false;
  }  
  if(flag == true){
    insertSchedule(text.slice(3,15),text.slice(16));
    replyMessage = Utilities.formatDate(time, 'JST', 'MM/dd HH:mm \n')+text.slice(16)+"\nで登録しました";
  }else if (flag == false){
    replyMessage = "登録:YYYYMMddHHmm:スケジュール\nの形で入力してください";
  }
  return replyMessage;
}

function cancelSchedule(text){  //if called delete,return success message or template of delete.
  const ret = deleteSchedule(text.slice(3));
  let replyMessage = "";
  if(ret == -1){
    replyMessage = "そのスケジュールは存在しません\n消去:日程orイベント名\nの形で入力してください"
  }else{
    replyMessage = ret+"\nを消去しました";
  }
  return replyMessage;
}

function another(text){ //dont called command,return search or template.
  const schedules = allSchedule();
  const index = searchSchedule(text);
  let replyMessage = "";
  if (index == -1){ //cant find task;
    replyMessage = "すべて\n全てのスケジュールを確認\n今日\n今日のスケジュールを確認\n登録:YYYYMMddHHmm:イベント\nスケジュール登録\n消去:日程orイベント名\nスケジュール消去";
  }else{  //find task
    replyMessage = "最短の "+text+" は\n"+Utilities.formatDate(numToDate(schedules[index][0]), 'JST', 'MM/dd HH:mm ')+schedules[index][0]+"\n"+schedules[index][1];
  }
  return replyMessage;
}

function retURL(){  //if called "URL",return sheetURL.
  return PropertiesService.getScriptProperties().getProperty('SheetsURL');
}
