/**
 * 设置随机背景图
 * 包含多个API源和错误处理机制
 */
function setRandomBackground() {
    // 可用API源列表
    const backgroundAPIs = [
        // 国内稳定源
        "https://api.btstu.cn/sjbz/?lx=m_heisi",
        "https://api.btstu.cn/sjbz/?lx=m_siwameitui",
        "https://api.btstu.cn/sjbz/?lx=meizi",
        "https://api.btstu.cn/sjbz/?lx=m_dongman",
        "https://api.yimian.xyz/img?type=heisi",
        "https://api.qingyun8.cn/api/sjbz/?type=siwa",
        "https://api.qingyun8.cn/api/sjbz/?type=meizi",
        // 国际源
        "https://pic.re/image",
        "https://api.waifu.pics/sfw/waifu",
        "https://api.lolicon.app/setu/v2?tag=白丝",
        "https://api.lolicon.app/setu/v2?tag=黑丝",
        // 备用源
        "https://img.xjh.me/random_img.php",
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=%E7%81%AB%E5%BD%B1%E5%BF%8D%E8%80%85",
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

// 天气功能 (使用高德地图API)
function fetchWeather() {
    const statusDiv = document.getElementById('weather-status');

    const amapConfig = {
        key: '02d4bd74cc1897fcb432cc2f77f15098',
        securityCode: 'fd70b506e58e5953e91efe72322b9aff',
        defaultCity: '330400' // 嘉兴
    };

    function startWeatherSystem() {
        window._AMapSecurityConfig = { securityJsCode: amapConfig.securityCode };

        if (typeof AMap === 'undefined') {
            const script = document.createElement('script');
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapConfig.key}`;
            script.onload = runAmapLogic;
            script.onerror = fallbackWeather;
            document.head.appendChild(script);
        } else {
            runAmapLogic();
        }
    }

    function runAmapLogic() {
        AMap.plugin(['AMap.Geolocation', 'AMap.Weather'], function() {
            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: false,
                timeout: 3000
            });
            const weather = new AMap.Weather();

            geolocation.getCityInfo((status, result) => {
                let targetAdcode = amapConfig.defaultCity;
                if (status === 'complete' && result.adcode) {
                    targetAdcode = result.adcode;
                    console.log("定位成功:", result.city);
                } else {
                    console.warn("定位失败，使用默认城市");
                }

                weather.getLive(targetAdcode, (err, data) => {
                    if (!err && data.info === 'OK') {
                        statusDiv.innerText = `${data.city}: ${data.weather} ${data.temperature}℃`;
                    } else {
                        fallbackWeather();
                    }
                });
            });
        });
    }

    function fallbackWeather() {
        console.log("使用备用天气信息");
        statusDiv.innerText = "Weather: Sunny 25℃";
    }

    startWeatherSystem();
}

// 初始化音乐播放器
function initMusicPlayer() {
    const ap = new APlayer({
        container: document.getElementById('aplayer'),
        fixed: true,
        mini: true,
        autoplay: false,
        theme: '#06b6d4',
        order: 'random',
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        lrcType: 1,
        listFolded: true,
        listMaxHeight: 90,
        audio: [{
            name: '起风了',
            artist: '买辣椒也用券',
            url: 'https://music.163.com/song/media/outer/url?id=1330348068.mp3',
            cover: 'https://p1.music.126.net/diGAyEmpymX8G7JcnElncQ==/109951163696969069.jpg',
            lrc: 'https://music.163.com/api/song/lyric?id=1330348068&lv=1'
        }, {
            name: '夜に駆ける',
            artist: 'YOASOBI',
            url: 'https://music.163.com/song/media/outer/url?id=1413863166.mp3',
            cover: 'https://p2.music.126.net/9idkdzbel_-lYBP7Dv_dVA==/109951164955246383.jpg',
            lrc: 'https://music.163.com/api/song/lyric?id=1413863166&lv=1'
        }]
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
    initMusicPlayer();
    setRandomBackground();
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
