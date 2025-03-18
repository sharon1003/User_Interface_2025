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
    
    static renewBalance(newBalance) {
        console.log("Renew Balance of Current User to:", newBalance);
        const user = this.getLoggedInUser();
        
        if (user) {
            user.balance = newBalance;
            this.setLoggedInUser(user);
            
            // Also update the user in the users array if needed for persistence
            const userIndex = this.users.findIndex(u => u.username === user.username);
            if (userIndex !== -1) {
                this.users[userIndex].balance = newBalance;
            }
            
            return true;
        }
        
        return false;
    }

    // log out
    static logout(){
        console.log("Remove");
        localStorage.removeItem("loggedInUser");
    }

}