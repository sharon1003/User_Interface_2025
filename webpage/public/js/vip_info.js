import UserModel from "./user_model.js";
import {loadOrders} from "./orders_model.js";

const person = UserModel.getLoggedInUser();
const orders = loadOrders();

document.getElementById("BalNum").innerHTML = person.balance;

document.getElementById("Greeting").innerHTML = person.username;

document.getElementById("OrderHistory").innerText = orders;