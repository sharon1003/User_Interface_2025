// 定義翻譯內容
const translations = {
    en: {
        home: "Home",
        login: "Log In",
        welcome: "Welcome to The Flying Dutchman",
        explore: "Explore the Menu",
        chooseRole: "Choose Your Role",
        vip: "VIP Customer",
        vipDesc: "Order drinks, food, and enjoy your time!",
        staff: "Bartender/Waiter",
        staffDesc: "Manage orders and ensure great service!",
        owner: "Owner",
        ownerDesc: "Oversee inventory and business operations!",
        menu: "MENU",
        shoppingCart: "Shopping Cart",
        addToCart: "Add to Cart",
        total: "Total: ",
        spirit: "Spirit",
        wine: "Wine",
        cocktail: "Cocktail",
        beer: "Beer"
    },
    sv: {
        home: "Hem",
        login: "Logga in",
        welcome: "Välkommen till The Flying Dutchman",
        explore: "Utforska menyn",
        chooseRole: "Välj din roll",
        vip: "VIP Kund",
        vipDesc: "Beställ drycker, mat och njut!",
        staff: "Bartender/Servitör",
        staffDesc: "Hantera beställningar och ge bra service!",
        owner: "Ägare",
        ownerDesc: "Hantera lager och verksamhet!",
        menu: "MENY",
        shoppingCart: "Varukorg",
        addToCart: "Lägg till i kundvagnen",
        total: "Totalt: ",
        spirit: "Sprit",
        wine: "Vin",
        cocktail: "Cocktail",
        beer: "Öl"
    },
    tw: {
        home: "首頁",
        login: "登入",
        welcome: "歡迎來到 飛行荷蘭人",
        explore: "探索菜單",
        chooseRole: "選擇你的角色",
        vip: "VIP顧客",
        vipDesc: "點飲品、簡餐，盡情享受時光！",
        staff: "吧檯/服務生",
        staffDesc: "管理訂單，提供卓越的服務！",
        owner: "老闆",
        ownerDesc: "管理庫存和營運！",
        menu: "菜單",
        shoppingCart: "購物車",
        addToCart: "加入購物車",
        total: "總計：",
        spirit: "烈酒",
        wine: "紅白酒",
        cocktail: "雞尾酒",
        beer: "啤酒"
    },
    ch: { 
        home: "首页",
        login: "登录",
        welcome: "欢迎来到 飞翔荷兰人",
        explore: "探索菜单",
        chooseRole: "选择你的角色",
        vip: "VIP顾客",
        vipDesc: "点饮品、简餐，尽情享受时光！",
        staff: "吧台/服务生",
        staffDesc: "管理订单，提供卓越的服务！",
        owner: "老板",
        ownerDesc: "管理库存和运营！",
        menu: "菜单",
        shoppingCart: "购物车",
        addToCart: "加入购物车",
        total: "总计：",
        spirit: "烈酒",
        wine: "红白酒",
        cocktail: "鸡尾酒",
        beer: "啤酒"
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
