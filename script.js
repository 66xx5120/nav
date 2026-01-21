/**
 * 设置随机背景图
 * 包含多个API源和错误处理机制
 */
function setRandomBackground() {
    // 可用API源列表
    const backgroundAPIs = [
        "https://api.btstu.cn/sjbz/?lx=m_heisi",
        "https://api.btstu.cn/sjbz/?lx=m_siwameitui",
        "https://api.btstu.cn/sjbz/?lx=meizi",
        "https://api.btstu.cn/sjbz/?lx=m_dongman",
        "https://api.yimian.xyz/img?type=heisi",
        "https://api.qingyun8.cn/api/sjbz/?type=siwa",
        "https://api.qingyun8.cn/api/sjbz/?type=meizi",
        "https://pic.re/image",
        "https://api.waifu.pics/sfw/waifu",
        "https://api.paugram.com/wallpaper"
    ];

    const background = document.querySelector('.background');
    const maxRetry = 3;
    let retryCount = 0;
    let lastUsedAPI = localStorage.getItem('lastBackgroundAPI') || '';

    const availableAPIs = backgroundAPIs.filter(api => api !== lastUsedAPI);

    function loadRandomBackground() {
        if (retryCount >= maxRetry) {
            console.log('达到最大重试次数，使用默认背景');
            setDefaultBackground();
            return;
        }

        const apiUrl = availableAPIs.length > 0 
            ? availableAPIs[Math.floor(Math.random() * availableAPIs.length)]
            : backgroundAPIs[Math.floor(Math.random() * backgroundAPIs.length)];

        const finalUrl = apiUrl + (apiUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

        console.log('尝试加载背景:', finalUrl);
        const img = new Image();

        img.onload = function() {
            background.style.opacity = 0;
            background.style.backgroundImage = `url('${finalUrl}')`;
            localStorage.setItem('lastBackgroundAPI', apiUrl);
            
            setTimeout(() => {
                background.style.transition = 'opacity 1s ease';
                background.style.opacity = 1;
            }, 100);
        };

        img.onerror = function() {
            console.log('加载失败:', finalUrl);
            retryCount++;
            
            const index = availableAPIs.indexOf(apiUrl);
            if (index > -1) {
                availableAPIs.splice(index, 1);
            }
            
            setTimeout(loadRandomBackground, 500);
        };

        img.src = finalUrl;
    }

    function setDefaultBackground() {
        const defaultImages = [
            './local-images/default1.jpg',
            './local-images/default2.jpg'
        ];
        const randomDefault = defaultImages[Math.floor(Math.random() * defaultImages.length)];
        background.style.backgroundImage = `url('${randomDefault}')`;
    }

    background.style.backgroundSize = 'cover';
    background.style.backgroundPosition = 'center';
    background.style.backgroundRepeat = 'no-repeat';
    background.style.transition = 'opacity 0.5s ease';

    loadRandomBackground();
}

// 搜索配置
const searchEngines = {
    google: { url: "https://www.google.com/search?q=", icon: "fab fa-google", placeholder: "Search with Google..." },
    baidu: { url: "https://www.baidu.com/s?wd=", icon: "fas fa-paw", placeholder: "百度一下，你就知道" },
    bing: { url: "https://www.bing.com/search?q=", icon: "fab fa-microsoft", placeholder: "Search with Bing..." },
    duckduckgo: { url: "https://duckduckgo.com/?q=", icon: "fas fa-shield-alt", placeholder: "Privacy Search..." }
};

const engineKeys = Object.keys(searchEngines);
let currentEngineIndex = 2;
let currentEngine = engineKeys[currentEngineIndex];

function toggleEngineMenu() { 
    document.getElementById('engine-options').classList.toggle('show'); 
}

function selectEngine(engineKey) {
    if (!searchEngines[engineKey]) return;
    
    currentEngineIndex = engineKeys.indexOf(engineKey);
    currentEngine = engineKey;
    
    const engine = searchEngines[engineKey];
    document.getElementById('current-engine-icon').className = engine.icon;
    const input = document.getElementById('search-input');
    input.placeholder = engine.placeholder;
    
    const menu = document.getElementById('engine-options');
    if (menu.classList.contains('show')) menu.classList.remove('show');
    input.focus();
}

function doSearch() {
    const query = document.getElementById('search-input').value;
    if (query) window.open(searchEngines[currentEngine].url + encodeURIComponent(query), '_blank');
}

document.addEventListener('click', function(e) {
    const selector = document.getElementById('engine-selector');
    const menu = document.getElementById('engine-options');
    if (!selector.contains(e.target) && menu.classList.contains('show')) menu.classList.remove('show');
});

document.getElementById('search-input').addEventListener('keydown', function (e) { 
    if (e.key === 'Enter') {
        doSearch();
    } else if (e.key === 'Tab') {
        e.preventDefault();
        currentEngineIndex = (currentEngineIndex + 1) % engineKeys.length;
        selectEngine(engineKeys[currentEngineIndex]);
    }
});

// 实时时钟 + 问候
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
    
    const hour = now.getHours();
    let greeting = "你好";
    if (hour < 5) greeting = "夜深了，注意休息";
    else if (hour < 9) greeting = "新的一天，早上好！";
    else if (hour < 13) greeting = "中午好，记得吃饭";
    else if (hour < 18) greeting = "下午好，喝杯茶提提神";
    else if (hour < 23) greeting = "晚上好，享受属于你的时间";
    else greeting = "夜深了，晚安";
    document.getElementById('greeting').innerText = greeting;
}

// 一言 API
function fetchHitokoto() {
    fetch('https://v1.hitokoto.cn/?c=a&c=b')
        .then(response => response.json())
        .then(data => { 
            document.getElementById('hitokoto_text').innerText = `${data.hitokoto} —— ${data.from}`; 
        })
        .catch(() => { 
            document.getElementById('hitokoto_text').innerText = "System connected. Ready for input.";
        });
}

// 简化天气功能
function fetchWeather() {
    const statusDiv = document.getElementById('weather-status');
    
    // 使用更简单的天气API
    fetch('https://api.qweather.com/v7/weather/now?location=auto&key=YOUR_KEY_HERE')
        .then(response => response.json())
        .then(data => {
            if(data.now) {
                statusDiv.innerText = `${data.now.text} ${data.now.temp}℃`;
            }
        })
        .catch(() => {
            statusDiv.innerText = "Weather Offline";
        });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('preloader');
    
    setTimeout(function() {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 500); 
    }, 300); 

    updateClock();
    setInterval(updateClock, 1000);
    fetchHitokoto();
    fetchWeather();
});

window.addEventListener('load', function() {
    const loader = document.getElementById('preloader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
});

setInterval(setRandomBackground, 60 * 60 * 1000);
document.querySelector('.background').addEventListener('click', setRandomBackground);

console.log(
    "%c Six's Terminal %c System Ready ",
    "background:#06b6d4; color:#000; font-weight:bold; border-radius: 4px 0 0 4px; padding: 4px;",
    "background:#0f172a; color:#06b6d4; font-weight:bold; border: 1px solid #06b6d4; border-radius: 0 4px 4px 0; padding: 3px;"
);
