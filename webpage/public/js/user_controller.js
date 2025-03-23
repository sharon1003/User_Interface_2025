import UserModel from './user_model.js';
import UserView from './user_view.js';

class UserController {
    static async login(event) {
        event.preventDefault(); // prevent form from reloading the page
        await UserModel.loadUsers(); // load users from users.json

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = UserModel.authenticate(username, password);

        if (user) 
        {
            UserModel.setLoggedInUser(user); // save user session
            UserView.showMessage(`Success! Welcome ${user.role}`, "green");

            // redirect based on user role
            setTimeout(() => {
                if (user.role === "vip-customer") {
                    console.log(user.role);
                    window.location.href = "vip-menu.html";
                } else if (user.role === "owner") {
                    window.location.href = "owner.html";
                } else if (user.role === "bartender") {
                    window.location.href = "bartender.html";
                } else {
                    window.location.href = "index.html";
                }
            }, 1000);
        } 
        else 
        {
            UserView.showMessage("Username/Password is incorrect", "red");
        }
    }

    // log out
    static logout() {
        UserModel.logout();
        UserView.updateAuthLink(null);
        console.log("log out");
        window.location.href = "index.html";
    }

    
    // check if current user is a VIP
    static checkVIPAccess() {
        const user = UserModel.getLoggedInUser();
        if (user && user.role === "vip-customer") {
            document.getElementById("vipWelcomeMessage").innerText = `Hello VIP ${user.username}!`;
        } else {
            window.location.href = "login.html"; // 非 VIP 用戶回到登入頁
        }
    }
}

// handle custom logout event
document.addEventListener("user-logout", () => {
    UserController.logout();
});

// check VIP access on VIP menu page
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("vip_menu.html")) {
        UserController.checkVIPAccess();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form[action='loginForm']");
    UserView.updateAuthLink(UserModel.getLoggedInUser());
    if (loginForm) {
        loginForm.addEventListener("submit", UserController.login);
    }
});

export default UserController;
