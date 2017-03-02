
var inputBox = document.getElementById('input')

function compile ( ) {
    document.getElementById('output').innerText =
        KaryScript.Compiler.Compile( inputBox.value, 'main.k' ).code
}

inputBox.onkeyup = compile
compile( )