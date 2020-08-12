// Protocol Corporation Ltda.
// https://github.com/ProtocolLive/Ajax
// Version 2020.08.11.01

if(typeof AjaxObject === 'undefined'){
  var AjaxObject = []
  var AjaxLoading = ''
}

function AjaxExecute(Place){
  let Command
  let Text = document.getElementById(Place).innerHTML
  while(Text.indexOf('<script') >= 0){
    Text = Text.substr(Text.indexOf('<script') + 7)
    Text = Text.substr(Text.indexOf('>') + 1)
    Command = Text.substr(0, Text.indexOf('<\/script>'))
    if(Command !== ''){
      window.eval(Command)
    }
    Text = Text.substr(Text.indexOf('<\/script>') + 9)
  }
}

function AjaxFetch(Url, Return, Form){
  let Data = null
  if(Form !== undefined){
    Data = {
      method: 'POST',
      body: new FormData(document.forms[Form])
    }
  }
  fetch(Url, Data)
  .then(
    document.getElementById(Return).innerHTML = AjaxLoading
  )
  .then((response)=>{
    if(response.status !== 200){
      document.getElementById(Return).innerHTML = "Error " + response.status
    }else{
      response.text()
      .then((result)=>{
        document.getElementById(Return).innerHTML = result
        AjaxExecute(Return)
      })
    }
  })
  .catch((error)=>{
    document.getElementById(Return).innerHTML = error.message
  })
}

function AjaxXtr(Url, Return, Form){
  const place = document.getElementById(Return).innerHTML
  let Data = null
  if(AjaxObject[Return] == undefined){
    try{
      AjaxObject[Return] = new XMLHttpRequest()
    }catch(e){
      try{
        AjaxObject[Return] = new ActiveXObject('Microsoft.XMLHTTP')
      }catch(e){
        AjaxObject[Return] = new ActiveXObject('Msxml2.XMLHTTP')
      }
    }
  }
  AjaxObject[Return].onreadystatechange = ()=>{
    if(AjaxObject[Return].readyState == 1){
      place = AjaxLoading
      document.documentElement.style.cursor = 'progress'
    }else if(AjaxObject[Return].readyState == 3){
      place = AjaxLoading += AjaxObject[Return].responseText
    }else if(AjaxObject[Return].readyState == 4 && AjaxObject[Return].status == 404){
      place = 'Error 404: Page not found'
      document.documentElement.style.cursor = 'default'
    }else if(AjaxObject[Return].readyState == 4){
      place = AjaxObject[Return].responseText
      AjaxExecute(Return)
      document.documentElement.style.cursor = 'default'
    }
  }
  AjaxObject[Return].ontimeout = (e)=>{
    place = 'Loading timeout!'
    document.documentElement.style.cursor = 'default'
  }
  if(typeof Form === 'undefined' || Form === null){
    AjaxObject[Return].open('GET', Url, true)
  }else{
    Data = new FormData(document.forms[Form])
    AjaxObject[Return].open('POST', Url, true)
  }
  AjaxObject[Return].timeout = 60000
  AjaxObject[Return].send(Data)
}

function Ajax(Url, Return, Form){
  if('fetch' in window){
    AjaxFetch(Url, Return, Form)
  }else{
    AjaxXtr(Url, Return, Form)
  }
}