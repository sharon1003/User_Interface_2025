// Dictionary for the entire project

const translations = {
    en: {
        special: "Special",
        food: "Food",
        home: "Home",
        login: "Log In",
        logout: "Logout",
        //title: "The Flying Dutchman",
        welcome: "Welcome to The Flying Dutchman",
        explore: "Explore the Menu",
        chooseRole: "Choose Your Role",
        vip: "VIP Customer",
        vipDesc: "Order drinks, food, and enjoy your time!",
        staff: "Bartender/Waiter",
        staffDesc: "Manage orders and ensure great service!",
        owner: "Owner",
        ownerDesc: "Oversee inventory and business operations!",
        manage: "Manage Inventory",
        menu: "MENU",
        shoppingCart: "Shopping Cart",
        addToCart: "Add to Cart",
        total: "Total: ",
        spirit: "Spirit",
        wine: "Wine",
        cocktail: "Cocktail",
        beer: "Beer",
        info: "Info",
        vipid: "My account",
        username: "Username",
        password: "Password",
        submit: "Submit",
        vipMenu: "Welcome to the VIP special Menu",
        greetingMessege: "welcome!",
        history: "My orders: ",
        balance: "Balance: "
    },
    sv: {
        special: "Särskild",
        food: "Mat",
        home: "Hem",
        login: "Logga in",
        logout: "Logga ut",
        //title: "The Flying Dutchman",
        welcome: "Välkommen till The Flying Dutchman",
        explore: "Utforska menyn",
        chooseRole: "Välj din roll",
        vip: "VIP Kund",
        vipDesc: "Beställ drycker, mat och njut!",
        staff: "Bartender/Servitör",
        staffDesc: "Hantera beställningar och ge bra service!",
        owner: "Ägare",
        ownerDesc: "Hantera lager och verksamhet!",
        manage: "Hantera lager",
        menu: "MENY",
        shoppingCart: "Varukorg",
        addToCart: "Lägg till i kundvagnen",
        total: "Totalt: ",
        spirit: "Sprit",
        wine: "Vin",
        cocktail: "Cocktail",
        beer: "Öl",
        info: "Info",
        vipid: "Mitt konto",
        username: "Användarnamn",
        password: "Lösenord",
        submit: "Skicka",
        vipMenu: "Välkommen till VIP-specialmenyn",
        greetingMessege: "välkommen!",
        history: "Mina beställningar: ",
        balance: "Kontosaldo: "
    },
    tw: {
        special: "特別菜單",
        food: "小吃",
        home: "首頁",
        login: "登入",
        logout: "登出",
        //title: "飛行荷蘭人",
        welcome: "歡迎來到 飛行荷蘭人",
        explore: "探索菜單",
        chooseRole: "選擇你的角色",
        vip: "VIP顧客",
        vipDesc: "點飲品、簡餐，盡情享受時光！",
        staff: "吧檯/服務生",
        staffDesc: "管理訂單，提供卓越的服務！",
        owner: "老闆",
        ownerDesc: "管理庫存和營運！",
        manage: "管理庫存",
        menu: "菜單",
        shoppingCart: "購物車",
        addToCart: "加入購物車",
        total: "總計：",
        spirit: "烈酒",
        wine: "紅白酒",
        cocktail: "雞尾酒",
        beer: "啤酒",
        info: "個人中心",
        vipid: "我的帳戶",
        username: "使用者名稱",
        password: "密碼",
        submit: "提交",
        vipMenu: "歡迎來到VIP專屬菜單",
        greetingMessege: "歡迎！",
        history: "我的訂單：",
        balance: "餘額："
    },
    ch: { 
        special: "特别菜单",
        food: "小吃",
        home: "首页",
        login: "登录",
        logout: "登出",
        //title: "飞翔荷兰人",
        welcome: "欢迎来到 飞翔荷兰人",
        explore: "探索菜单",
        chooseRole: "选择你的角色",
        vip: "VIP顾客",
        vipDesc: "点饮品、简餐，尽情享受时光！",
        staff: "吧台/服务生",
        staffDesc: "管理订单，提供卓越的服务！",
        owner: "老板",
        ownerDesc: "管理库存和运营！",
        manage: "管理库存",
        menu: "菜单",
        shoppingCart: "购物车",
        addToCart: "加入购物车",
        total: "总计：",
        spirit: "烈酒",
        wine: "红白酒",
        cocktail: "鸡尾酒",
        beer: "啤酒",
        register: "新顾客？联系工作人员注册！",
        info: "个人中心",
        vipid: "我的账号",
        point: "积分",
        username: "用户名",
        password: "密码",
        submit: "提交",
        vipMenu: "欢迎来到VIP专属菜单",
        greetingMessege: "欢迎！",
        history: "我的订单：",
        balance: "余额："
    }
};

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("menu.html")) return "menu";
    if (path.includes("index.html") || path === "/") return "index";
    return "other";
}

function updateAuthLink(lang) {
    const authLink = document.querySelector("#auth-link a"); 
    if (!authLink) return; 

    const user = JSON.parse(localStorage.getItem("loggedInUser")); 

    if (user) {
        authLink.textContent = translations[lang]["logout"];
        authLink.setAttribute("data-i18n", "logout");
        authLink.href = "#";
        authLink.onclick = function (event) {
            event.preventDefault();
            localStorage.removeItem("loggedInUser");
            updateAuthButton(lang);
            location.reload();
        };
    } else {
        authLink.textContent = translations[lang]["login"];
        authLink.setAttribute("data-i18n", "login");
        authLink.href = "./login.html";
        authLink.onclick = null; 
    }
}

// change language
function changeLanguage(lang) {
    if (!translations[lang]) return;

    // index.html
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        console.log(key)
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
            console.log(el.textContent);
        }
    });

    const currentPage = getCurrentPage();
    if (currentPage === "menu") {
        document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
            //btn.innerText = translations[lang].addToCart;
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> ' + translations[lang].addToCart;
        });
    }
    localStorage.setItem("selectedLanguage", lang);

    if (typeof UserController !== "undefined" && UserController.updateAuthLink) {
        UserController.updateAuthLink();  
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedLang = btn.getAttribute("data-lang");
            changeLanguage(selectedLang);
        });
    });

    const savedLang = localStorage.getItem("selectedLanguage") || "en"; 
    changeLanguage(savedLang);
});
