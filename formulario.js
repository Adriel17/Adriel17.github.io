
/*
perguntas para adicionar:
Você recebe de tempos em tempos a visita de um encanador?
*/


var a = document.getElementById('a');
var b = document.getElementById('b');
var c = document.getElementById('c');
var d = document.getElementById('d');

var e = document.getElementsByName('r1');
var f = document.getElementsByName('r2');

console.log(e);
console.log(f);

function env() {
	document.getElementById("ratinho").style.visibility= "visible";
	document.getElementById("par").style.visibility= "visible";
	console.log("deu certo");
	if(e[0].checked==true){
		if (f[0].checked==true) {
			document.getElementById("par").innerHTML="Você não é o pai";
		}else{
			document.getElementById("par").innerHTML="Você é o pai";}
	}
	else{
			document.getElementById("par").innerHTML="Você não é o pai";
		}

		}