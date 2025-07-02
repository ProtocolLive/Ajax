//Protocol Corporation Ltda.
//https://github.com/ProtocolLive/Ajax
//Version 2025.07.02.00

/*
To use a loading animation, create an element with id "AjaxLoading".
*/

if(AjaxObject === undefined){
  var AjaxObject = []
}

function AjaxExecute(Place){
  Array.from(document.getElementById(Place).querySelectorAll('script')).forEach(Old => {
    let New = document.createElement('script')
    Array.from(Old.attributes).forEach(Att => {
      New.setAttribute(Att.name, Att.value)
    })
    New.appendChild(document.createTextNode(Old.innerHTML))
    Old.parentNode.replaceChild(New, Old)
  })
}

function AjaxFetch(Url, Return, Form, OnReady){
  if(Form !== undefined){
    Form = {
      method: 'POST',
      body: new FormData(document.forms[Form])
    }
  }
  AjaxLoading(Return)
  fetch(Url, Form)
  .then(response => {
    response.text()
    .then(result => {
      if(response.status !== 200
      && result === ''){
        document.getElementById(Return).innerHTML = 'Response error<br>'
        console.log('Ajax: Error ' + response.status + '\n' + response.statusText)
      }
      document.getElementById(Return).innerHTML = result
      if(response.status === 200){
        AjaxExecute(Return)
        if(OnReady !== undefined){
          OnReady()
        }
      }
    })
    .catch((error) => {
      document.getElementById(Return).innerHTML = 'Ajax error<br>'
      console.log('Ajax: ' + error.message)
    })
  })
  .catch((error)=>{
    document.getElementById(Return).innerHTML = 'Ajax error<br>'
    console.log('Ajax: ' + error.message)
  })
}

function AjaxLoading(Return){
  if(document.getElementById("AjaxLoading") !== null){
    document.getElementById(Return).innerHTML = document.getElementById("AjaxLoading").innerHTML
  }else{
    document.getElementById(Return).innerText = ""
  }
}

function AjaxXtr(Url, Return, Form, OnReady){
  if(Form !== undefined){
    Form = new FormData(document.forms[Form])
  }
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
  AjaxObject[Return].onreadystatechange = () => {
    if(AjaxObject[Return].readyState == 4
    && AjaxObject[Return].status !== 200){
      document.getElementById(Return).innerHTML = 'Ajax error<br>'
      console.log('Ajax: ' + error.message)
    }else if(AjaxObject[Return].readyState == 4){
      document.getElementById(Return).innerHTML = AjaxObject[Return].responseText
      AjaxExecute(Return)
      if(OnReady !== undefined){
        OnReady()
      }
    }
  }
  AjaxObject[Return].ontimeout = e => {
    document.getElementById(Return).innerHTML = 'Loading timeout!'
  }
  if(typeof Form === undefined){
    AjaxObject[Return].open('GET', Url, true)
  }else{
    AjaxObject[Return].open('POST', Url, true)
  }
  AjaxObject[Return].timeout = 60000
  AjaxObject[Return].send(Form)
  AjaxLoading(Return)
}

function Ajax(Url, Return, Form = undefined, OnReady = undefined){
  if(document.getElementById(Return) === null){
    console.log('Ajax error: \'' + Return + '\' is an invalid return element')
    return
  }
  if(Form !== undefined
  && document.forms[Form] === undefined){
    console.log('Ajax error: \'' + Form + '\' is an invalid form element')
    return
  }
  if('fetch' in window){
    AjaxFetch(Url, Return, Form, OnReady)
  }else{
    AjaxXtr(Url, Return, Form)
  }
}