(function() {
var title = document.getElementById("title");
var author = document.getElementById("author");
var submit = document.getElementById("submit");
var data = document.getElementById("data");


var data_error = document.getElementById("data-error")
var title_error = document.getElementById("title-error")
var author_error = document.getElementById("author-error")


var validTitle = false;
var validAuthor = false;
var validData = false;


title.addEventListener("input", ()=>{ checkTitle(); })
author.addEventListener("input", ()=>{ checkAuthor(); })
data.addEventListener("input", ()=>{ checkData(); })


var checkTitle = function(){
    let value = title.value;

    if(value==""){
        validTitle = false;
    }
    else if(value.length > 35){
        title.style.borderColor = "red";
        title_error.style.visibility = "visible";
        validTitle = false;
    }
    else{
        title.style.borderColor = "black";
        title_error.style.visibility = "hidden";
        validTitle = true;
    }
}

var checkAuthor = function(){
    let value = author.value;

    if(value==""){
        validAuthor = false;
    }
    else if(value.length > 30){
        author.style.borderColor = "red";
        author_error.style.visibility = "visible";
        validAuthor = false;
    }
    else{
        author.style.borderColor = "black";
        author_error.style.visibility = "hidden";
        validAuthor = true;
    }
}

var checkData = function(){
    let value = data.value;

    if(value==""){
        validData = false;
    }
    else if(value.length > 50000){
        data.style.borderColor = "red";
        data_error.style.visibility = "visible";
        validData = false;
    }
    else{
        data.style.borderColor = "black";
        data_error.style.visibility = "hidden";
        validData = true;
    }
}


function refresh(){
    if(validTitle == false || validAuthor == false || validData == false){
        submit.disabled = true;
    }
    else{
        submit.disabled = false;
    }
    requestAnimationFrame(refresh);
}
requestAnimationFrame(refresh);
})();