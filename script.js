// 1. 随机二次元背景 (防缓存优化版)
function setRandomBackground() {
    const baseUrl = "https://api.paugram.com/wallpaper/";
    // 如果上面的API挂了，可以用这个: const baseUrl = "https://t.mwm.moe/pc"; 
    
    const timestamp = new Date().getTime();
    const finalUrl = `${baseUrl}?t=${timestamp}`;
    const background = document.querySelector('.background');
    
    const img = new Image();
    img.src = finalUrl;
    img.onload = function() {
        background.style.backgroundImage = `url('${finalUrl}')`;
    };
}

// 2. 搜索功能配置 (支持多引擎切换)
const searchEngines = {
    google: {
        url: "https://www.google.com/search?q=",
        icon: "fab fa-google",
        placeholder: "Search with Google..."
    },
    baidu: {
        url: "https://www.baidu.com/s?wd=",
        icon: "fas fa-paw",
        placeholder: "百度一下，你就知道"
    },
    bing: {
        url: "https://www.bing.com/search?q=",
        icon: "fab fa-microsoft",
        placeholder: "Search with Bing..."
    },
    duckduckgo: {
        url: "https://duckduckgo.com/?q=",
        icon: "fas fa-shield-alt", 
        placeholder: "Privacy Search..."
    }
};

// 默认引擎设为 bing
let currentEngine = 'bing';

function toggleEngineMenu() {
    document.getElementById('engine-options').classList.toggle('show');
}

function selectEngine(engineKey) {
    const engine = searchEngines[engineKey];
    if (!engine) return;
    currentEngine = engineKey;
    
    document.getElementById('current-engine-icon').className = engine.icon;
    document.getElementById('search-input').placeholder = engine.placeholder;
    toggleEngineMenu();
}

function doSearch() {
    const query = document.getElementById('search-input').value;
    if (query) {
        window.open(searchEngines[currentEngine].url + encodeURIComponent(query), '_blank');
    }
}

// 点击外部关闭菜单
document.addEventListener('click', function(e) {
    const selector = document.getElementById('engine-selector');
    const menu = document.getElementById('engine-options');
    if (!selector.contains(e.target) && menu.classList.contains('show')) {
        menu.classList.remove('show');
    }
});

// 绑定回车键
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') doSearch();
});

// 3. 实时时钟
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
    
    const hour = now.getHours();
    let greeting = "你好";
    if (hour < 5) greeting = "修仙中？早点睡吧";
    else if (hour < 9) greeting = "新的一天，早上好！";
    else if (hour < 13) greeting = "努力工作，也要记得吃饭";
    else if (hour < 18) greeting = "下午好，喝杯茶提提神";
    else if (hour < 23) greeting = "晚上好，享受属于你的时间";
    else greeting = "夜深了，晚安";
    document.getElementById('greeting').innerText = greeting;
}

// 4. 一言 API
function fetchHitokoto() {
    fetch('https://v1.hitokoto.cn/?c=a&c=b')
        .then(response => response.json())
        .then(data => {
            document.getElementById('hitokoto_text').innerText = `${data.hitokoto} —— ${data.from}`;
        })
        .catch(() => {
            document.getElementById('hitokoto_text').innerText = "今天的风儿甚是喧嚣...";
        });
}

// 初始化
setRandomBackground();
setInterval(updateClock, 1000);
updateClock();
fetchHitokoto();