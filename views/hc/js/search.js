var inner = "";
var index = document.getElementById("holder").innerHTML;
var data = JSON.parse(index);

inner = inner + `<h2 class="Amount">Current amount of fartbin's: ` + data["length"] + "</h2>";

inner = inner + '<div class="fartbins">';
for(var i = 0; i < data["length"]; i++){
    var link = "https://fartbin.cf/"+data["url"+i];

    inner = inner + `<div> <br><br>Title: ` + data["title"+i] + `<br>url: <a target="_blank" href="${link}">${link}</a> </div>`;
}
inner = inner + "</div>"
document.getElementById("holder").innerHTML = inner;