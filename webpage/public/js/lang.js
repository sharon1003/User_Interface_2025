// 定義翻譯內容
const translations = {
    en: {
        home: "Home",
        login: "Log In",
        logout: "Logout",
        welcome: "Welcome to The Bar",
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
        total: "Total:",
        spirit: "Spirit",
        wine: "Wine",
        cocktail: "Cocktail",
        beer: "Beer",
        info: "Info",
        vipid: "My account"
    },
    sv: {
        home: "Hem",
        login: "Logga in",
        logout: "Logga ut",
        welcome: "Välkommen till The Bar",
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
        total: "Totalt:",
        spirit: "Sprit",
        wine: "Vin",
        cocktail: "Cocktail",
        beer: "Öl",
        info: "Info",
        vipid: "Mitt konto"
    },
    tw: {
        home: "首頁",
        login: "登入",
        logout: "登出",
        welcome: "歡迎來到 The Bar",
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
        vipid: "我的帳戶"
    },
    ch: { 
        home: "首页",
        login: "登录",
        logout: "退出",
        welcome: "欢迎来到 The Bar",
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
        total: "总计",
        spirit: "烈酒",
        wine: "红酒",
        cocktail: "鸡尾酒",
        beer: "啤酒",
        register: "新顾客？联系工作人员注册！",
        info: "个人中心",
        vipid: "我的账号",
        point: "积分"
    }
};

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("menu.html")) return "menu";
    if (path.includes("index.html") || path === "/") return "index";
    return "other";
}

// change language
function changeLanguage(lang) {
    if (!translations[lang]) return;

    // index.html
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    const currentPage = getCurrentPage();
    if (currentPage === "menu") {
        document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
            btn.innerText = translations[lang].addToCart;
        });
    }

    localStorage.setItem("selectedLanguage", lang);
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
