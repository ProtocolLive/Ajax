// Protocol Corporation Ltda.
// https://github.com/ProtocolLive/Ajax
// Version 2020.07.25.00

if(typeof AjaxObject == "undefined"){
  var AjaxObject = [];
  var AjaxLoading = '';
  var AjaxRefreshers = [];
}

function Ajax(Url, Return, Form, Refresh){
  let Data = null;
  clearTimeout(AjaxRefreshers[Return]);
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
      document.getElementById(Return).innerHTML = AjaxLoading;
      document.documentElement.style.cursor = "progress";
    }else if(AjaxObject[Return].readyState == 3){
      document.getElementById(Return).innerHTML = AjaxLoading;
      document.getElementById(Return).innerHTML += AjaxObject[Return].responseText;
    }else if(AjaxObject[Return].readyState == 4 && AjaxObject[Return].status == 404){
      document.getElementById(Return).innerHTML = "Error 404: Page not found";
      document.documentElement.style.cursor = "default";
    }else if(AjaxObject[Return].readyState == 4){
      document.getElementById(Return).innerHTML = AjaxObject[Return].responseText;
      if(Refresh !== undefined){
        AjaxRefreshers[Return] = setTimeout(function(){
          Ajax(Url, Return, null, Refresh);
        }, Refresh);
      }
      AjaxExecute(Return);
      document.documentElement.style.cursor = "default";
    }
  }
  AjaxObject[Return].ontimeout = function(e) {
    document.getElementById(Return).innerHTML = "Loading timeout!";
    document.documentElement.style.cursor = "default";
  };
  if(typeof Form == "undefined" || Form == null){
    AjaxObject[Return].open("GET", Url, true);
  }else{
    Data = AjaxParseSend(Form);
    AjaxObject[Return].open("POST", Url, true);
    AjaxObject[Return].setRequestHeader("Content-type", "application/x-www-form-Urlencoded");
  }
  AjaxObject[Return].timeout = 60000;
  AjaxObject[Return].send(Data);
}

if(typeof AjaxParseSend == "undefined"){
  function AjaxParseSend(Form){
    let send = "";
    Form = document.forms[Form].elements;
    for(let i = 0; i < Form.length; i++){
      if(Form[i].name != ""){
        if(Form[i].type == "checkbox"){
          if(Form[i].checked == true){
            send += Form[i].name + "=1";
          }else{
            send += Form[i].name + "=0";
          }
        }else if(Form[i].type == "radio"){
          if(Form[i].checked == true){
            send += Form[i].name + "=" + Form[i].value;
          }
        }else{
          send += Form[i].name + "=" + encodeURIComponent(Form[i].value);
        }
        if(i < (Form.length - 1)){
          send += "&";
        }
      }
    }
    return send;
  }
}

function AjaxExecute(Place){
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