// 1. 随机二次元背景 (保持不变，逻辑很完美)
function setRandomBackground() {
    const baseUrl = "https://api.paugram.com/wallpaper/";
    const timestamp = new Date().getTime();
    const finalUrl = `${baseUrl}?t=${timestamp}`;
    const background = document.querySelector('.background');
    const img = new Image();
    img.src = finalUrl;
    img.onload = function() { background.style.backgroundImage = `url('${finalUrl}')`; };
}

// 2. 搜索配置 (Tab 键循环切换)
const searchEngines = {
    google: { url: "https://www.google.com/search?q=", icon: "fab fa-google", placeholder: "Search with Google..." },
    baidu: { url: "https://www.baidu.com/s?wd=", icon: "fas fa-paw", placeholder: "百度一下，你就知道" },
    bing: { url: "https://www.bing.com/search?q=", icon: "fab fa-microsoft", placeholder: "Search with Bing..." },
    duckduckgo: { url: "https://duckduckgo.com/?q=", icon: "fas fa-shield-alt", placeholder: "Privacy Search..." }
};

// 定义引擎顺序，用于 Tab 切换
const engineKeys = Object.keys(searchEngines);
let currentEngineIndex = 2; // 默认 Bing (索引2)
let currentEngine = engineKeys[currentEngineIndex];

function toggleEngineMenu() { document.getElementById('engine-options').classList.toggle('show'); }

function selectEngine(engineKey) {
    if (!searchEngines[engineKey]) return;
    
    // 更新当前索引
    currentEngineIndex = engineKeys.indexOf(engineKey);
    currentEngine = engineKey;
    
    // 更新 UI
    const engine = searchEngines[engineKey];
    document.getElementById('current-engine-icon').className = engine.icon;
    const input = document.getElementById('search-input');
    input.placeholder = engine.placeholder;
    
    // 关闭菜单并聚焦
    const menu = document.getElementById('engine-options');
    if (menu.classList.contains('show')) menu.classList.remove('show');
    input.focus();
}

function doSearch() {
    const query = document.getElementById('search-input').value;
    if (query) window.open(searchEngines[currentEngine].url + encodeURIComponent(query), '_blank');
}

// 点击外部关闭菜单
document.addEventListener('click', function(e) {
    const selector = document.getElementById('engine-selector');
    const menu = document.getElementById('engine-options');
    if (!selector.contains(e.target) && menu.classList.contains('show')) menu.classList.remove('show');
});

// 键盘事件监听 (Enter 搜索, Tab 切换)
document.getElementById('search-input').addEventListener('keydown', function (e) { 
    if (e.key === 'Enter') {
        doSearch();
    } else if (e.key === 'Tab') {
        e.preventDefault(); // 阻止默认的切出焦点行为
        // 循环切换索引
        currentEngineIndex = (currentEngineIndex + 1) % engineKeys.length;
        selectEngine(engineKeys[currentEngineIndex]);
    }
});

// 3. 实时时钟 + 问候 (保持不变)
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

// 4. 一言 API (保持不变)
function fetchHitokoto() {
    fetch('https://v1.hitokoto.cn/?c=a&c=b')
        .then(response => response.json())
        .then(data => { document.getElementById('hitokoto_text').innerText = `${data.hitokoto} —— ${data.from}`; })
        .catch(() => { document.getElementById('hitokoto_text').innerText = "System connected. Ready for input."; });
}


// 5. 天气 (高德定位 -> 高德天气 -> 心知备用)
function fetchWeather() {
    const statusDiv = document.getElementById('weather-status');

    const amapConfig = {
        key: '02d4bd74cc1897fcb432cc2f77f15098',
        securityCode: 'fd70b506e58e5953e91efe72322b9aff',
        defaultCity: '320100' // 南京
    };

    const seniverseConfig = {
        key: 'SBhWcvdeh-GwBOsHR',
        location: 'ip'
    };

    function startWeatherSystem() {
        window._AMapSecurityConfig = { securityJsCode: amapConfig.securityCode };

        if (typeof AMap === 'undefined') {
            const script = document.createElement('script');
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapConfig.key}`;
            script.onload = runAmapLogic;
            script.onerror = trySeniverse; // 脚本加载失败直接切备用
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
                        trySeniverse();
                    }
                });
            });
        });
    }

    function trySeniverse() {
        console.log("Switching to Seniverse Weather...");
        const url = `https://api.seniverse.com/v3/weather/now.json?key=${seniverseConfig.key}&location=${seniverseConfig.location}&language=zh-Hans&unit=c`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results[0]) {
                    const res = data.results[0];
                    statusDiv.innerText = `${res.location.name}: ${res.now.text} ${res.now.temperature}℃`;
                }
            })
            .catch(() => { statusDiv.innerText = "Weather Offline"; });
    }

    startWeatherSystem();
}


// 6. 自动获取 GitHub Star 数
function fetchGithubStars() {
    const starCountElem = document.getElementById('github-star-count');
    
    fetch('https://api.github.com/repos/loong2004/my-nav-page')
        .then(response => {
            if (response.status === 403 || response.status === 429) {
                throw new Error("Rate Limit Exceeded");
            }
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.stargazers_count !== undefined) {
                starCountElem.innerText = data.stargazers_count;
            } else {
                starCountElem.innerText = "-";
            }
        })
        .catch(err => {
            console.warn("GitHub Star fetch failed:", err.message);
            starCountElem.innerText = "N/A";
            starCountElem.title = "GitHub API Rate Limit or Network Error";
        });
}

// 7. 网络状态监控 (仅保留 Latency Matrix)
function checkNetworkStatus() {
    
    // === Part B: Latency Matrix ===
    const targets = [
        { id: 'bytedance', url: 'https://www.douyin.com/favicon.ico' },
        { id: 'bilibili', url: 'https://www.bilibili.com/favicon.ico' },
        { id: 'wechat', url: 'https://weixin.qq.com/favicon.ico' },
        { id: 'taobao', url: 'https://www.taobao.com/favicon.ico' },
        { id: 'github', url: 'https://github.com/favicon.ico' },
        { id: 'jsdelivr', url: 'https://cdn.jsdelivr.net/favicon.ico' },
        { id: 'cloudflare', url: 'https://www.cloudflare.com/favicon.ico' },
        { id: 'youtube', url: 'https://www.youtube.com/favicon.ico' }
    ];

    // 辅助函数: 生成信号灯 HTML
    const renderStatusDots = (latency) => {
        let colorClass = 'green';
        let activeCount = 6;

        if (latency === -1) { // Timeout/Error
            colorClass = 'red';
            activeCount = 0;
        } else if (latency < 100) {
            colorClass = 'green';
            activeCount = 6;
        } else if (latency < 250) {
            colorClass = 'yellow';
            activeCount = 4;
        } else {
            colorClass = 'red';
            activeCount = 2;
        }

        let html = '';
        for (let i = 0; i < 6; i++) {
            // 前 activeCount 个点是亮色的，剩下的是灰色的(默认背景色)
            const isActive = i < activeCount;
            const className = isActive ? `dot ${colorClass}` : 'dot';
            html += `<div class="${className}"></div>`;
        }
        return { html, colorClass };
    };

    targets.forEach(target => {
        const textElem = document.getElementById(`ping-${target.id}`);
        const dotsElem = document.getElementById(`status-${target.id}`);
        
        const start = performance.now();
        const timeout = 5000;
        
        // 使用 no-cors 模式发出请求，只为了测速
        // 添加时间戳防止缓存
        const request = fetch(`${target.url}?t=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' });
        
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));

        Promise.race([request, timeoutPromise])
            .then(() => {
                const end = performance.now();
                const latency = Math.round(end - start);
                
                // 更新文字
                textElem.innerText = `${latency}ms`;
                
                // 生成并更新信号灯
                const status = renderStatusDots(latency);
                dotsElem.innerHTML = status.html;
                
                // 更新文字颜色
                textElem.className = `net-latency text-${status.colorClass}`;
            })
            .catch(() => {
                textElem.innerText = 'Timeout';
                textElem.className = 'net-latency text-red';
                dotsElem.innerHTML = renderStatusDots(-1).html;
            });
    });
}

// 8. 预加载控制 (System Initialization)
window.addEventListener('load', function() {
    const loader = document.getElementById('preloader');
    
    // 设置一个最小展示时间，防止加载太快导致动画一闪而过
    // 这里设置 1500毫秒 (1.5秒)，你可以根据需要调整
    setTimeout(function() {
        loader.classList.add('hidden');
        
        // 动画结束后彻底移除元素，释放内存
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // 配合 CSS transition 的 0.5s
    }, 1500);
});

// 初始化
setRandomBackground();
setInterval(updateClock, 1000);
updateClock();
fetchHitokoto();
fetchWeather();
fetchGithubStars();
checkNetworkStatus(); // 启动网络监测

// 打印个酷一点的 Console 欢迎语
console.log(
    "%c Loong's Terminal %c System Online ",
    "background:#06b6d4; color:#000; font-weight:bold; border-radius: 4px 0 0 4px; padding: 4px;",
    "background:#0f172a; color:#06b6d4; font-weight:bold; border: 1px solid #06b6d4; border-radius: 0 4px 4px 0; padding: 3px;"
);