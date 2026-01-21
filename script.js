/**
 * 设置随机背景图（使用代理解决Cloudflare拦截问题）
 */
function setRandomBackground() {
    // 代理服务器配置
    const PROXY_SERVER = "https://cors-anywhere.herokuapp.com/"; // 公共代理示例
    // 或者使用自己的代理： "https://your-proxy-server.com/?url=";

    // 可用API源列表（已过滤可能被拦截的源）
    const backgroundAPIs = [
        "https://api.btstu.cn/sjbz/?lx=m_heisi",
        "https://api.btstu.cn/sjbz/?lx=m_siwameitui",
        "https://api.btstu.cn/sjbz/?lx=meizi",
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

    function loadRandomBackground() {
        if (retryCount >= maxRetry) {
            setDefaultBackground();
            return;
        }

        const apiUrl = backgroundAPIs[Math.floor(Math.random() * backgroundAPIs.length)];
        const finalUrl = apiUrl + (apiUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

        // 使用代理请求
        const proxyUrl = `${PROXY_SERVER}${encodeURIComponent(finalUrl)}`;
        
        console.log('Loading via proxy:', proxyUrl);
        const img = new Image();

        // 双保险：直接请求和代理请求
        const imgLoader = (url, isProxy = false) => {
            return new Promise((resolve, reject) => {
                const testImg = new Image();
                testImg.onload = () => resolve(url);
                testImg.onerror = () => reject();
                testImg.src = url;
            });
        };

        // 尝试直接加载
        imgLoader(finalUrl)
            .then(url => {
                console.log('Direct load success');
                applyBackground(url);
            })
            .catch(() => {
                console.log('Direct load failed, trying proxy');
                // 尝试代理加载
                imgLoader(proxyUrl, true)
                    .then(url => {
                        console.log('Proxy load success');
                        applyBackground(url);
                    })
                    .catch(() => {
                        console.log('Proxy load failed');
                        retryCount++;
                        setTimeout(loadRandomBackground, 500);
                    });
            });
    }

    function applyBackground(url) {
        background.style.opacity = 0;
        background.style.backgroundImage = `url('${url}')`;
        setTimeout(() => {
            background.style.transition = 'opacity 1s ease';
            background.style.opacity = 1;
        }, 100);
    }

    function setDefaultBackground() {
        const defaultImages = [
            './local-images/default1.jpg',
            './local-images/default2.jpg'
        ];
        const randomDefault = defaultImages[Math.floor(Math.random() * defaultImages.length)];
        background.style.backgroundImage = `url('${randomDefault}')`;
    }

    // 初始化背景样式
    background.style.backgroundSize = 'cover';
    background.style.backgroundPosition = 'center';
    background.style.backgroundRepeat = 'no-repeat';
    background.style.transition = 'opacity 0.5s ease';

    loadRandomBackground();
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

// 3. 实时时钟 + 问候
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

// 4. 一言 API
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
        defaultCity: '330400' // 嘉兴
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
    
    fetch('https://api.github.com/repos/66xx5120/nav')
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

// 7. 网络状态监控 (Refined: 动态生成 + 实时心跳 + 呼吸感监测)
function checkNetworkStatus() {
    const grid = document.getElementById('network-grid');
    if (!grid) {
        console.error('Network grid element not found');
        return;
    }
    
    // 配置列表
    const targets = [
        { id: 'bytedance', name: '字节跳动', icon: 'fab fa-tiktok', type: 'cn', url: 'https://www.douyin.com/favicon.ico' },
        { id: 'bilibili', name: 'Bilibili', icon: 'fab fa-bilibili', type: 'cn', url: 'https://www.bilibili.com/favicon.ico' },
        { id: 'wechat', name: '微信', icon: 'fab fa-weixin', type: 'cn', url: 'https://weixin.qq.com/favicon.ico' },
        { id: 'taobao', name: '淘宝', icon: 'fas fa-shopping-bag', type: 'cn', url: 'https://www.taobao.com/favicon.ico' },
        { id: 'github', name: 'GitHub', icon: 'fab fa-github', type: 'intl', url: 'https://github.com/favicon.ico' },
        { id: 'jsdelivr', name: 'jsDelivr', icon: 'fas fa-cube', type: 'intl', url: 'https://cdn.jsdelivr.net/favicon.ico' },
        { id: 'cloudflare', name: 'Cloudflare', icon: 'fas fa-cloud', type: 'intl', url: 'https://www.cloudflare.com/favicon.ico' },
        { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', type: 'intl', url: 'https://www.youtube.com/favicon.ico' }
    ];

    // 1. 动态生成卡片 (DRY)
    grid.innerHTML = targets.map(t => `
        <div class="net-card">
            <div class="net-header">
                <span class="net-icon"><i class="${t.icon}"></i> ${t.name}</span>
                <span class="net-badge badge-${t.type}">${t.type === 'cn' ? '国内' : '国际'}</span>
            </div>
            <div class="net-body">
                <span class="net-latency" id="ping-${t.id}">WAIT</span>
                <div class="status-dots" id="status-${t.id}">
                    <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                    <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                </div>
            </div>
        </div>
    `).join('');

    // 2. 渲染信号灯 (Helper)
    const renderStatusDots = (latency, elem) => {
        let colorClass = 'green';
        let activeCount = 6;

        if (latency === -1) { // Timeout/Error
            colorClass = 'red';
            activeCount = 1;
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
            const isActive = i < activeCount;
            const className = isActive ? `dot ${colorClass}` : 'dot';
            html += `<div class="${className}"></div>`;
        }
        elem.innerHTML = html;
        return colorClass;
    };

    // 3. 核心测速函数 (单次)
    const pingTarget = async (target) => {
        const textElem = document.getElementById(`ping-${target.id}`);
        const dotsElem = document.getElementById(`status-${target.id}`);
        if (!textElem || !dotsElem) return;

        const start = performance.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

        try {
            // mode: 'no-cors' 是必须的，cache: 'no-store' 加上时间戳强制不缓存
            await fetch(`${target.url}?t=${Date.now()}`, { 
                mode: 'no-cors', 
                cache: 'no-store',
                signal: controller.signal 
            });
            
            clearTimeout(timeoutId);
            const end = performance.now();
            // 增加随机抖动(0-5ms)，模拟真实波动
            const jitter = Math.floor(Math.random() * 5); 
            const latency = Math.round(end - start) + jitter;

            textElem.innerText = `${latency}ms`;
            const color = renderStatusDots(latency, dotsElem);
            textElem.className = `net-latency text-${color}`;

        } catch (error) {
            textElem.innerText = 'OFF';
            textElem.className = 'net-latency text-red';
            renderStatusDots(-1, dotsElem);
        }
    };

    // 4. 启动无限循环 (Heartbeat Loop)
    targets.forEach(target => {
        const loop = async () => {
            await pingTarget(target);
            
            // 随机间隔 1.5s 到 3.5s，让由于网络波动造成的数值跳动看起来"此起彼伏"
            const nextDelay = Math.floor(Math.random() * 2000) + 1500; 
            setTimeout(loop, nextDelay);
        };
        
        // 错峰启动，防止页面刚加载时瞬间卡顿
        setTimeout(loop, Math.random() * 1000);
    });
}

// 8. 极速预加载控制 (System Initialization - Turbo Mode)
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('preloader');
    
    // 300ms 极短缓冲，仅为了平滑过渡
    setTimeout(function() {
        loader.classList.add('hidden');
        
        // 动画结束后彻底移除元素，释放内存
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); 
    }, 300); 

    // 初始化所有功能
    updateClock(); // 立即更新时间
    setInterval(updateClock, 1000); // 设置定时器
    fetchHitokoto();
    fetchWeather();
    fetchGithubStars();
    checkNetworkStatus(); // 初始化网络状态监控
});

// 兜底策略：以防 DOMContentLoaded 未触发
window.addEventListener('load', function() {
    const loader = document.getElementById('preloader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
});

// 每小时自动更换背景
setInterval(setRandomBackground, 60 * 60 * 1000);

// 点击背景更换图片（可选）
document.querySelector('.background').addEventListener('click', setRandomBackground);

console.log(
    "%c Six's Terminal %c System Ready ",
    "background:#06b6d4; color:#000; font-weight:bold; border-radius: 4px 0 0 4px; padding: 4px;",
    "background:#0f172a; color:#06b6d4; font-weight:bold; border: 1px solid #06b6d4; border-radius: 0 4px 4px 0; padding: 3px;"
);
