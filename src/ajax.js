//Protocol Corporation Ltda.
//https://github.com/ProtocolLive/Ajax
//Version 2024.11.09.00

/*
To use a loading animation, create an element with id "AjaxLoading".
*/

if(typeof AjaxObject === 'undefined'){
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

function AjaxFetch(Url, Return, Form){
  fetch(Url, Form)
  .then((response)=>{
    response.text()
    .then((result)=>{
      document.getElementById(Return).innerHTML = ""
      if(response.status !== 200
      && result === ''){
        document.getElementById(Return).innerHTML = 'Response error<br>'
        console.log('Ajax: Error ' + response.status + '\n' + response.statusText)
      }
      document.getElementById(Return).innerHTML += result
      if(response.status === 200){
        AjaxExecute(Return)
      }
    })
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
  if(typeof Form === undefined){
    AjaxObject[Return].open('GET', Url, true)
  }else{
    AjaxObject[Return].open('POST', Url, true)
  }
  AjaxObject[Return].timeout = 60000
  AjaxObject[Return].send(Form)
}

function Ajax(Url, Return, Form){
  if(document.getElementById(Return) === null){
    console.log('Ajax error: Invalid return element')
    return
  }
  if(Form !== undefined && document.forms[Form] === undefined){
    console.log('Ajax error: Invalid form element')
    return
  }
  if('fetch' in window){
    if(Form !== undefined){
      Form = {
        method: 'POST',
        body: new FormData(document.forms[Form])
      }
    }
    Loading(Return)
    AjaxFetch(Url, Return, Form)
  }else{
    if(Form !== undefined){
      Form = new FormData(document.forms[Form])
    }
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