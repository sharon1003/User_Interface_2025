import UserModel from './user_model.js';

export default class UserView {
    // Display message
    static showMessage(message, color = "black") {
        const messageElement = document.getElementById("loginMessage");
        messageElement.innerText = message;
        messageElement.style.color = color;
    }

    // update login/logout link in the nav bar
    static updateAuthLink() {
        const user = UserModel.getLoggedInUser();
        const authLink = document.getElementById("auth-link");

        if (authLink) {
            let authAnchor = authLink.querySelector("a");

            // create <a> tag if it doesn't exist
            if (!authAnchor) {
                authAnchor = document.createElement("a");
                authLink.appendChild(authAnchor);
            }

            const lang = localStorage.getItem("selectedLanguage") || "en";

            if (user) {
                // If logged in, show "Logout" link
                authAnchor.textContent = translations[lang]["logout"];
                authAnchor.setAttribute("data-i18n", "logout");
                authAnchor.href = "#";
                authAnchor.id = "logout-btn";

                authAnchor.onclick = (event) => {
                    event.preventDefault();
                    document.dispatchEvent(new Event("user-logout")); // 發送登出事件
                };
            } else {
                // If not logged in, show "Login" link
                authAnchor.textContent = translations[lang]["login"];
                authAnchor.setAttribute("data-i18n", "login");
                authAnchor.href = "./login.html";
                authAnchor.id = "";
                authAnchor.onclick = null;
            }
        }
    }

}
