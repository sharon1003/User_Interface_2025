/*document.getElementById("code-popup");

window.onclick = function(event) {
    /*if (event.target == modal) {
        modal.style.display = "none";
    }
}*/

const button = document.getElementById("code-btn");

function codeGenerator () {
    document.getElementById("code-btn").innerHTML = 
    "The code of fridge is " + 
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>`;
}
button.onclick = codeGenerator;
console.log("123");
