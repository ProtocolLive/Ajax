//Protocol Corporation Ltda.
//https://github.com/ProtocolLive/Ajax
//Version 2025.06.15.04

/*
To use a loading animation, create an element with id "AjaxLoading".
*/

if(typeof AjaxObject === undefined){
  var AjaxObject = []
  var AjaxLoading = ''
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
  fetch(Url, Form)
  .then(response => {
    response.text()
    .then(result => {
      if(response.status !== 200
      && result === ''){
        document.getElementById(Return).innerHTML = 'Response error<br>'
        console.log('Ajax: Error ' + response.status + '\n' + response.statusText)
      }
      document.getElementById(Return).innerHTML += result
      if(response.status === 200){
        AjaxExecute(Return)
        if(OnReady !== null){
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

function AjaxXtr(Url, Return, Form){
  if(Form !== undefined){
    Form = new FormData(document.forms[Form])
  }
  const place = document.getElementById(Return).innerHTML
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
  AjaxObject[Return].ontimeout = e => {
    place = 'Loading timeout!'
    document.documentElement.style.cursor = 'default'
  }
  if(typeof Form === undefined){
    AjaxObject[Return].open('GET', Url, true)
  }else{
    AjaxObject[Return].open('POST', Url, true)
  }
  AjaxObject[Return].timeout = 60000
  AjaxObject[Return].send(Form)
}

function Ajax(Url, Return, Form = null, OnReady = null){
  if(document.getElementById(Return) === null){
    console.log('Ajax error: \'' + Return + '\' is an invalid return element')
    return
  }
  if(Form !== null
  && document.forms[Form] === undefined){
    console.log('Ajax error: \'' + Form + '\' is an invalid form element')
    return
  }
  if('fetch' in window){
    Loading(Return)
    AjaxFetch(Url, Return, Form, OnReady)
  }else{
    Loading(Return)
    AjaxXtr(Url, Return, Form)
  }
}

function Loading(Return){
  if(document.getElementById("AjaxLoading") !== null){
    document.getElementById(Return).innerHTML = document.getElementById("AjaxLoading").innerHTML
  }else{
    document.getElementById(Return).innerText = ""
  }
}