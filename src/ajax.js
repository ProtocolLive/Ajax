// Protocol Corporation Ltda.
// https://github.com/ProtocolLive/Ajax
// Version 2020.05.02.00

let AjaxObject = [];
let Refreshers = [];

function Ajax(Url, Return, Form, Refresh){
  let Data = null;
  clearTimeout(Refreshers[Return]);
  if(AjaxObject[Return] == undefined){
    try{
      AjaxObject[Return] = new XMLHttpRequest();
    }catch(e){
      try{
        AjaxObject[Return] = new ActiveXObject("Microsoft.XMLHTTP");
      }catch(e){
        AjaxObject[Return] = new ActiveXObject("Msxml2.XMLHTTP");
      }
    }
  }
  AjaxObject[Return].onreadystatechange = function(){
    if(AjaxObject[Return].readyState == 1){
      document.getElementById(Return).innerHTML = "<img src=\"https://raw.githubusercontent.com/ProtocolLive/PublicImg/master/src/loading.gif\" alt=\"\">";
      document.body.style.cursor = "progress";
    }else if(AjaxObject[Return].readyState == 3){
      document.getElementById(Return).innerHTML = "<img src=\"https://raw.githubusercontent.com/ProtocolLive/PublicImg/master/src/loading.gif\" alt=\"\"><br>";
      document.getElementById(Return).innerHTML += AjaxObject[Return].responseText;
    }else if(AjaxObject[Return].readyState == 4 && AjaxObject[Return].status == 404){
      document.getElementById(Return).innerHTML = "Error 404: Page not found";
      document.body.style.cursor = "default";
    }else if(AjaxObject[Return].readyState == 4){
      document.getElementById(Return).innerHTML = AjaxObject[Return].responseText;
      if(Refresh !== undefined){
        Refreshers[Return] = setTimeout(function(){
          Ajax(Url, Return, null, Refresh);
        }, Refresh);
      }
      Execute(Return);
      document.body.style.cursor = "default";
    }
  }
  AjaxObject[Return].ontimeout = function(e) {
    document.getElementById(Return).innerHTML = "Loading timeout!";
  };
  if(typeof Form == "undefined" || Form == null){
    AjaxObject[Return].open("GET", Url, true);
  }else{
    Data = ParseSend(Form);
    AjaxObject[Return].open("POST", Url, true);
    AjaxObject[Return].setRequestHeader("Content-type", "application/x-www-form-Urlencoded");
    AjaxObject[Return].setRequestHeader("Content-length", Data.length);
    AjaxObject[Return].setRequestHeader("Connection", "close");
  }
  AjaxObject[Return].timeout = 60000;
  AjaxObject[Return].send(Data);
}

function ParseSend(Form){
  let send = "";
  Form = document.forms[Form].elements;
  for(let i = 0; i < Form.length; i++){
    if(Form[i].name != ""){
      if(Form[i].type == "checkbox"){
        send += Form[i].name + "=" + Form[i].checked;
      }else if(Form[i].type == "radio"){
        if(Form[i].checked == true){
          send += Form[i].name + "=" + Form[i].value;
        }
      }else{
        send += Form[i].name + "=" + Form[i].value;
      }
      if(i < (Form.length - 1)){
        send += "&";
      }
    }
  }
  return send;
}

function Execute(Place){
  let Command;
  let Text = document.getElementById(Place).innerHTML;
  while(Text.indexOf("<script") >= 0){
    Text = Text.substr(Text.indexOf("<script") + 7);
    Text = Text.substr(Text.indexOf(">") + 1);
    Command = Text.substr(0, Text.indexOf("<\/script>"));
    if(Command != ""){
      window.eval(Command);
    }
    Text = Text.substr(Text.indexOf("<\/script>") + 9);
  }
}