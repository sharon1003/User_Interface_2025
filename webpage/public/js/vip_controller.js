
const button = document.getElementById("code-btn");

// Generate a 4-digit code
function codeGenerator () {
    document.getElementById("code-btn").innerHTML = 
    "The code of fridge is " + 
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>`;
}
button.onclick = codeGenerator;
//console.log("123");
