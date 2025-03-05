document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止默认提交

    // const role = document.getElementById('role').value;
    const userDatabase = {
    "alice": { password: "123456", role: "customer" },
    "bob": { password: "vip123", role: "vip" },
    "charlie": { password: "staff456", role: "staff" },
    "admin": { password: "admin789", role: "owner" }
    };

    const username = document.getElementById('username').value.trim().toLowerCase(); // 统一小写
    const password = document.getElementById('password').value.trim();
    const loginMessage = document.getElementById('loginMessage');

    if (!username || !password) {
        loginMessage.innerText = "Please enter both username and password.";
        return;
    }

    // 校验用户名是否存在
    if (userDatabase.hasOwnProperty(username)) {
        // 校验密码
        if (userDatabase[username].password === password) {
            const role = userDatabase[username].role;
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('role', role);

            // 根据角色跳转
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
