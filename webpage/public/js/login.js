import userDatabase from "../data/UserDB.json" with { type : "json"};

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止默认提交

    // const role = document.getElementById('role').value;
    /*const userDatabase = {
    "alice": { password: "123456", role: "customer" },
    "bob": { password: "vip123", role: "vip" },
    "charlie": { password: "staff456", role: "staff" },
    "admin": { password: "admin789", role: "owner" }
    };*/

    const username = document.getElementById('username').value.trim().toLowerCase(); // 统一小写
    const password = document.getElementById('password').value.trim();
    const loginMessage = document.getElementById('loginMessage');

    if (!username || !password) {
        //console.log("aaa");
        
        loginMessage.innerText = "Please enter both username and password.";
        return;
    }

    // if user exists
    if (userDatabase.hasOwnProperty(username)) {
        // if password correct
        if (userDatabase[username].password === password) {
            const role = userDatabase[username].role;
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('role', role);
            localStorage.setItem('person', userDatabase[username]);
            console.log(localStorage.getItem('person'));

            // redirect to role pages
            const rolePageMap = {
                "customer": "menu.html",
                "vip": "vip-menu.html",
                "staff": "bartender.html",
                "owner": "owner.html"
            };

            window.location.href = rolePageMap[role];
        } else {
            loginMessage.innerText = "Incorrect password!";
        }
    } else {
        loginMessage.innerText = "Username not found!";
    }
});
