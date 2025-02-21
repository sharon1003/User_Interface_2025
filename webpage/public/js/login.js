document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const role = document.getElementById('role').value;

    if (username) {
        // 模擬登入 (實務上應與後端驗證)
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('role', role);

        // 跳轉至對應頁面
        switch (role) {
            case 'customer':
                window.location.href = 'menu.html';
                break;
            case 'vip':
                window.location.href = 'vip.html';
                break;
            case 'staff':
                window.location.href = 'bartender.html';
                break;
            case 'owner':
                window.location.href = 'admin.html';
                break;
            default:
                document.getElementById('loginMessage').innerText = "Invalid role!";
        }
    } else {
        document.getElementById('loginMessage').innerText = "Please enter a username.";
    }
});
