// 簡易語言切換
const translations = {
    en: {
        welcome: "Welcome to The Flying Dutchman",
        slogan: "A voyage through taste and tradition.",
        chooseRole: "Choose Your Role",
        customer: "Customer",
        customerDesc: "Order drinks, food, and enjoy your time!",
        vip: "VIP Customer",
        vipDesc: "Access exclusive drinks and VIP services!",
        staff: "Bartender/Waiter",
        staffDesc: "Manage orders and ensure great service!",
        owner: "Owner",
        ownerDesc: "Oversee inventory and business operations!",
        specials: "Today's Specials",
        ipa: "IPA Beer - Swedish Craft",
        wine: "Red Wine - 2019 Merlot",
        snacks: "Signature Bar Snacks"
    },
    sv: {
        welcome: "Välkommen till The Flying Dutchman",
        slogan: "En smakresa genom tradition.",
        chooseRole: "Välj din roll",
        customer: "Kund",
        customerDesc: "Beställ drycker, mat och njut!",
        vip: "VIP Kund",
        vipDesc: "Tillgång till exklusiva drycker och tjänster!",
        staff: "Bartender/Servitör",
        staffDesc: "Hantera beställningar och ge bra service!",
        owner: "Ägare",
        ownerDesc: "Hantera lager och verksamhet!",
        specials: "Dagens specialiteter",
        ipa: "IPA-öl - Svensk hantverksöl",
        wine: "Rödvin - Merlot 2019",
        snacks: "Signaturbarer snacks"
    },
    zh: {
        welcome: "歡迎來到飛翔的荷蘭人酒吧",
        slogan: "品味與傳統的探索之旅。",
        chooseRole: "請選擇您的角色",
        customer: "顧客",
        customerDesc: "點飲品、簡餐，盡情享受時光！",
        vip: "VIP顧客",
        vipDesc: "享受專屬菜單和尊榮服務！",
        staff: "吧檯/服務生",
        staffDesc: "管理訂單，提供卓越的服務！",
        owner: "老闆",
        ownerDesc: "管理庫存和營運。",
        specials: "今日特選",
        ipa: "IPA啤酒 - 瑞典手工啤酒",
        wine: "紅酒 - 2019年梅洛",
        snacks: "招牌下酒菜"
    },
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}
