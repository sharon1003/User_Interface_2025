export default class UserModel {
    static users = [];

    static async loadUsers() {
        try {
            const response = await fetch("../data/user.json");
            const data = await response.json();
            this.users = data.users;
        } catch (error) {
            console.error("There is no users", error);
        }
    }

    static authenticate(username, password) {
        return this.users.find(user => user.username === username && user.password === password);
    }

    // store login status
    static setLoggedInUser(user) {
        console.log("Set Logged In User");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    static getLoggedInUser() {
        console.log("Get Logged In User");
        return JSON.parse(localStorage.getItem("loggedInUser"));
    }

    // log out
    static logout(){
        console.log("Remove");
        localStorage.removeItem("loggedInUser");
    }

}