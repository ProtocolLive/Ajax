// Protocol Corporation Ltda.
// https://github.com/ProtocolLive/Ajax
// Version 2020.07.23.00

if(typeof AjaxObject == "undefined"){
  var AjaxObject = [];
}

function AjaxAppend(Url, Table, Form, Position = -1){
  let Data = null;
  let Line = null;
  if(AjaxObject[Table] == undefined){
    try{
      AjaxObject[Table] = new XMLHttpRequest();
    }catch(e){
      try{
        AjaxObject[Table] = new ActiveXObject("Microsoft.XMLHTTP");
      }catch(e){
        AjaxObject[Table] = new ActiveXObject("Msxml2.XMLHTTP");
      }
    }
  }
  AjaxObject[Table].onreadystatechange = function(){
    if(AjaxObject[Table].readyState == 1){
      document.documentElement.style.cursor = "progress";
    }else if(AjaxObject[Table].readyState == 4){
      Line = document.getElementById(Table).insertRow(Position);
      Line.innerHTML = AjaxObject[Table].responseText;
      document.documentElement.style.cursor = "default";
    }
  }
  AjaxObject[Table].ontimeout = function(e) {
    document.documentElement.style.cursor = "default";
  };
  if(typeof Form == "undefined" || Form == null){
    AjaxObject[Table].open("GET", Url, true);
  }else{
    Data = AjaxParseSend(Form);
    AjaxObject[Table].open("POST", Url, true);
    AjaxObject[Table].setRequestHeader("Content-type", "application/x-www-form-Urlencoded");
    AjaxObject[Table].setRequestHeader("Content-length", Data.length);
    AjaxObject[Table].setRequestHeader("Connection", "close");
  }
  AjaxObject[Table].timeout = 60000;
  AjaxObject[Table].send(Data);
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