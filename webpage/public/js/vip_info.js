import UserModel from "./user_model.js";
const person = UserModel.getLoggedInUser();

document.getElementById("BalNum").innerHTML = person.balance;

document.getElementById("Greeting").innerHTML = person.username;