#Scheduler(Line,GAS)  
●プログラム説明  
Lineで操作するスケジューラ．LineからGoogleSpreadSheetsにスケジュールを登録し，登録した時間にLineで通知する．  


●内容  
line.gs:Line操作関連のGASファイル  
sheet.gs:SpreadSheets操作関連のGASファイル 
trigger.gs:トリガー操作関連のGASファイル  
sample1.png:実行した画像例1  
sample2.png:実行した画像例2  
README.md:プログラム説明 


●実行に必要なもの  
・Lineアカウント  
・Googleアカウント  

●前準備    
1. チャネルを作成する(https://developers.line.biz/ja/docs/messaging-api/)    
2.スケジュールを記録するSpreadSheetを用意し，シート2を追加，共有をリンクを知っている全員にする      
3.SpreadSheetの拡張機能→AppScriptから新規プロジェクトを作成する  
4.エディタ→サービスを追加からGoogleSheetsAPIを追加  
5.プロジェクトの設定→スクリプトプロパティから以下のプロパティを追加する  
&ensp; 5.1プロパティ:Id，値:LineのユーザID  
&ensp; 5.2プロパティ:Token，値:LineDeveloppersのチャネルからMessaging API設定のチャネルアクセストークン   
&ensp; 5.3プロパティ:SheetsURL，作成したSpreadSheetのURL  
6. エディタ→ファイルを追加→スクリプトからline.gsとsheet.gs，trigger.gsを追加しそれぞれの中身をコピペする  
7.トリガー→トリガーを追加から，実行する関数をdeleteTrigger，イベントのソースを時間主導型，時間ベースのトリガーを日付ベースのタイマー，時刻を深夜等のスケジュールを設定しない時間に指定する  
8.新しいデプロイ→ウェブアプリ，アクセスできるユーザを全員にしてデプロイ，URLをコピーする  
9.LineDeveloppersのチャネルからMessaging API設定のWebhook URLに先ほどのURLをペースト  
10.Webhookの利用を有効にする  


●利用方法   
    〇 登録:YYYYMMddHHmm:スケジュール内容　と作成したアカウントにLineで送信するとSpreadSheet上にスケジュールが登録されます     
    〇 消去:YYYYMMddHHmm　もしくは消去:スケジュール内容　と作成したアカウントにLineで送信するとシート１上から消去されます（消去したスケジュールはシート2に保存されます）     
    〇 登録した時間になると通知が来ます（通知されたスケジュールはシート1から消され，シート2に保存されます）       
    〇 今日　と作成したアカウントにLineで送信すると今日のスケジュールを一覧で表示します  
    〇 URL　と作成したアカウントにLineで送信するとSpreadSheetのURLを表示します  
    〇 すべて　と作成したアカウントにLineで送信するとすべてのスケジュールを一覧で表示します    


 
	


