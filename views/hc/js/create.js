var title = document.getElementById("title");
var author = document.getElementById("author");
var submit = document.getElementById("submit");


var validTitle = false;
var validAuthor = false;

title.addEventListener("input", ()=>{
    let value = title.value;

    if(value==""){
        validTitle = false;
    }
    else if(value.length > 40){
        let str = value.substring(0, value.length - 1);
        title.value = str;
        alert("Title can't be longer than 40 characters!")
        validTitle = false;
    }
    else{
        validTitle = true;
    }
})

author.addEventListener("input", ()=>{
    let value = author.value;

    if(value==""){
        validAuthor = false;
    }
    else if(value.length > 30){
        let str = value.substring(0, value.length - 1);
        author.value = str;

        alert("Author can't be longer than 30 characters!")
        validAuthor = false;
    }
    else{
        validAuthor = true;
    }
})




function refresh(){
    if(validTitle == false || validAuthor == false){
        submit.disabled = true;
    }
    else{
        submit.disabled = false;
    }
    requestAnimationFrame(refresh);
}
requestAnimationFrame(refresh);