# Ajax

## Sintax
Ajax ( url, destination_area[, form_to_submit[, seconds_to_refresh]]) void

## Parameters

### url
Page to be called

### destination_area
Id of an object in html

### form_to_submit (Optional)
Form name to be sended

### seconds_to_refresh (Optional)
The area indicated above will be refreshed in x seconds

## Examples

### Simple call:
```
<span id="area1">Hellow world</span><br>
<a href="#" onclick="Ajax('index.php', 'area1')">
```

### A call with form:
```
<form name="form1">
  <input type="text" name="text1"><br>
  <input type="button" value="Send" onclick="Ajax('index.php?action=edit', 'area1', 'form1')">
  <span id="area1"></span><br>
</form>
```
