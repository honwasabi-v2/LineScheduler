function createTriger(){  
  let target = new Date;
  target.setHours(target.getHours()+1);
  console.log("today:"+target);
  let schedules = allSchedule();
  for(let count=0;count < getScheduleRange()-1;count++){
    const date = numToDate(schedules[count][0]);  
    if(date.getFullYear() == target.getFullYear()){
      if(date.getMonth() == target.getMonth()){
        if(date.getDate() == target.getDate()){
          if(date.getHours() == target.getHours()){
            console.log("date:"+date);
            console.log("task:"+schedules[count][1]);
            const trigger = ScriptApp.newTrigger("taskSend").timeBased().at(date).create();
            setValueToSpreadsheetBySheetsApi("シート1!c"+(count+2),trigger.getUniqueId());
          }
        }
      }
    }
  }
}


function deleteTrigger(){
  const triggers = ScriptApp.getProjectTriggers();
    for(let trigger of triggers){
      if(trigger.getHandlerFunction() == "taskSend"){
        ScriptApp.deleteTrigger(trigger);
        console.log("deleteTrigger:"+trigger.getUniqueId());
      }
    }
}

function taskSend(e){
  const schedules = allSchedule();
  const id = e.triggerUid;
  today = new Date();
  for(let schedule of schedules){
    const date = numToDate(schedule[0]);  
    if(schedule[2] == id){
      const text = Utilities.formatDate(date, 'JST', 'HH:mm')+" "+schedule[1];
      sendMessege(text);
      deleteSchedule(schedule[1]);
      console.log("taskSend:"+text);
    }
  }
}

