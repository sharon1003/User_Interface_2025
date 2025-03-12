import UserModel from './user_model.js';

export default class UserView {
    static showMessage(message, color = "black") {
        const messageElement = document.getElementById("loginMessage");
        messageElement.innerText = message;
        messageElement.style.color = color;
    }

    static updateAuthLink() {
        const user = UserModel.getLoggedInUser();
        const authLink = document.getElementById("auth-link");

        if (authLink) {
            let authAnchor = authLink.querySelector("a");

            // 如果 <a> 還沒建立，就建立它
            if (!authAnchor) {
                authAnchor = document.createElement("a");
                authLink.appendChild(authAnchor);
            }

            const lang = localStorage.getItem("selectedLanguage") || "en";

            if (user) {
                authAnchor.textContent = translations[lang]["logout"];
                authAnchor.setAttribute("data-i18n", "logout");
                authAnchor.href = "#";
                authAnchor.id = "logout-btn";

                authAnchor.onclick = (event) => {
                    event.preventDefault();
                    document.dispatchEvent(new Event("user-logout")); // 發送登出事件
                };
            } else {
                authAnchor.textContent = translations[lang]["login"];
                authAnchor.setAttribute("data-i18n", "login");
                authAnchor.href = "./login.html";
                authAnchor.id = "";
                authAnchor.onclick = null;
            }
        }
    }

}
