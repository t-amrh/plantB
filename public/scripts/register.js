function show_pw(id){
    let elem = document.getElementById(id);
    if (elem.type == 'password')
        elem.type = 'text';
    else if (elem.type == 'text')
        elem.type = 'password';
};

function eval_pw(){
    let pw = document.getElementById("password");
    let pw_rep = document.getElementById("passwordrep");


    if (pw.value == '' && pw_rep.value == ''){
        pw.style["background-color"] = "white";
    }
    else if (pw.value == pw_rep.value){
        pw.style["background-color"] = "#DCEDC8";
    }
    else {
        pw.style["background-color"] = "#FFCDD2";
    };
};