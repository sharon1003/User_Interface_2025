import UserModel from './user_model.js';
import UserView from './user_view.js';

class UserController {
    static async login(event) {
        event.preventDefault(); // 防止表單提交刷新頁面
        await UserModel.loadUsers(); // 先讀取 users.json

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = UserModel.authenticate(username, password);

        if (user) 
        {
            UserModel.setLoggedInUser(user);
            UserView.showMessage(`Success! Welcome ${user.role}`, "green");

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

    static logout() {
        UserModel.logout();
        UserView.updateAuthLink(null);
        console.log("log out");
        window.location.href = "login.html";
    }

    
    static checkVIPAccess() {
        const user = UserModel.getLoggedInUser();
        if (user && user.role === "vip-customer") {
            document.getElementById("vipWelcomeMessage").innerText = `Hello VIP ${user.username}!`;
        } else {
            window.location.href = "login.html"; // 非 VIP 用戶回到登入頁
        }
    }
}

document.addEventListener("user-logout", () => {
    UserController.logout();
});

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("vip_menu.html")) {
        UserController.checkVIPAccess();

        // const logoutBtn = document.getElementById("logout-btn");
        // const logoutLink = document.getElementById("logout-link");
        // if (logoutBtn) logoutBtn.addEventListener("click", UserController.logout);
        // if (logoutLink) logoutLink.addEventListener("click", (event) => {
        //     event.preventDefault();
        //     UserController.logout();
        // });
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
