var AjaxObject = [], Refreshers = [];

function Ajax(Url, Return, Form, Refresh){
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
    }else if(AjaxObject[Return].readyState == 4 && AjaxObject[Return].status == 404){
      document.getElementById(Return).innerHTML = "Error 404: Page not found";
      document.body.style.cursor = "default";
    }else if(AjaxObject[Return].readyState == 4 && (AjaxObject[Return].status == 200 || AjaxObject[Return].status == 500)){
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
  if(typeof Data == undefined || Data == null){
    AjaxObject[Return].open("GET", Url, true);
  }else{
    var Data = ParseSend(Form);
    AjaxObject[Return].open("POST", Url, true);
    AjaxObject[Return].setRequestHeader("Content-type", "application/x-www-form-Urlencoded");
    AjaxObject[Return].setRequestHeader("Content-length", Data.length);
    AjaxObject[Return].setRequestHeader("Connection", "close");
  }
  AjaxObject[Return].send(Data);
}

function ParseSend(Form){
  var send = "";
  for(i = 0; i < Form.length; i++){
    if(Form[i].name != ""){
      send += Form[i].name + "=" + Form[i].value;
      if(i < (Form.length - 2)){
        send += "&";
      }
    }
  }
  return send;
}

function Execute(Place){
  var Command, Text = document.getElementById(Place).innerHTML;
  while(Text.indexOf("<script") >= 0){
    Text = Text.substr(Text.indexOf("<script") + 7);
    Text = Text.substr(Text.indexOf(">") + 1);
    Command = Text.substr(0, Text.indexOf("</script>"));
    if(Command != ""){
      window.eval(Command);
    }
    Text = Text.substr(Text.indexOf("</script>") + 9);
  }
}