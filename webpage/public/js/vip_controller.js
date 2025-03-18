//window.codeGenerator = codeGenerator;
import UserModel from "./user_model.js";
document.getElementById("code-popup");
const outlog = document.getElementById("auth-link");
outlog.onclick = UserModel.logout;

window.onclick = function(event) {
    /*if (event.target == modal) {
        modal.style.display = "none";
    }*/
}

const button = document.getElementById("code-btn");

function codeGenerator () {
    document.getElementById("code-popup").innerHTML = 
    "The code of fridge is " + 
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>` +
    `<b>${Math.floor(Math.random() * 10)}</b>`;
}
button.onclick = codeGenerator;
