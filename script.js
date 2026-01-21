/**
 * 设置随机背景图
 * 包含多个API源和错误处理机制
 */
function setRandomBackground() {
    // 可用API源列表
    const backgroundAPIs = [
        // 国内稳定源
        "https://api.btstu.cn/sjbz/?lx=m_heisi",          // 黑丝专题
        "https://api.btstu.cn/sjbz/?lx=m_siwameitui",     // 丝袜美腿
        "https://api.btstu.cn/sjbz/?lx=meizi",            // 随机美女
        "https://api.btstu.cn/sjbz/?lx=m_dongman",        // 动漫风格
        "https://api.yimian.xyz/img?type=heisi",          // 黑丝API
        "https://api.qingyun8.cn/api/sjbz/?type=siwa",    // 丝袜专题
        "https://api.qingyun8.cn/api/sjbz/?type=meizi",   // 高清美女
        // 国际源
        "https://pic.re/image",                           // 日本二次元
        "https://api.waifu.pics/sfw/waifu",               // 二次元角色
        "https://api.lolicon.app/setu/v2?tag=白丝",        // LOLICON API(白丝)
        "https://api.lolicon.app/setu/v2?tag=黑丝",        // LOLICON API(黑丝)
        // "https://api.waifu.pics/nsfw/waifu",            // NSFW(需谨慎使用)
        // 备用源
        "https://img.xjh.me/random_img.php",
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=%E7%81%AB%E5%BD%B1%E5%BF%8D%E8%80%85",   // 火影忍者自适应
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=P%E7%AB%99%E7%B3%BB%E5%88%971",     // P站画师GTZ taejune的插画
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=P%E7%AB%99%E7%B3%BB%E5%88%972",     // P站系列2（湿身女孩们的美图分享）
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=P%E7%AB%99%E7%B3%BB%E5%88%973",     // P站画师 TID含NSFW(需谨慎使用) 
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E8%87%AA%E9%80%82%E5%BA%94%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=%E5%8E%9F%E7%A5%9E",  // 原神
        "https://api.paugram.com/wallpaper"
    ];

    const background = document.querySelector('.background');
    const maxRetry = 3; // 最大重试次数
    let retryCount = 0;
    let lastUsedAPI = localStorage.getItem('lastBackgroundAPI') || '';

    // 过滤掉最近使用过的API（避免重复）
    const availableAPIs = backgroundAPIs.filter(api => api !== lastUsedAPI);

    function loadRandomBackground() {
        if (retryCount >= maxRetry) {
            console.log('达到最大重试次数，使用默认背景');
            setDefaultBackground();
            return;
        }

        // 随机选择API（优先从未使用的API中选择）
        const apiUrl = availableAPIs.length > 0 
            ? availableAPIs[Math.floor(Math.random() * availableAPIs.length)]
            : backgroundAPIs[Math.floor(Math.random() * backgroundAPIs.length)];

        // 添加时间戳防止缓存
        const finalUrl = apiUrl + (apiUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

        console.log('尝试加载背景:', finalUrl);
        const img = new Image();

        img.onload = function() {
            // 添加淡入效果
            background.style.opacity = 0;
            background.style.backgroundImage = `url('${finalUrl}')`;
            
            // 存储最后使用的API
            localStorage.setItem('lastBackgroundAPI', apiUrl);
            
            // 淡入动画
            setTimeout(() => {
                background.style.transition = 'opacity 1s ease';
                background.style.opacity = 1;
            }, 100);
        };

        img.onerror = function() {
            console.log('加载失败:', finalUrl);
            retryCount++;
            
            // 从可用列表中移除失败的API
            const index = availableAPIs.indexOf(apiUrl);
            if (index > -1) {
                availableAPIs.splice(index, 1);
            }
            
            // 延迟500ms后重试
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

    // 初始化背景样式
    background.style.backgroundSize = 'cover';
    background.style.backgroundPosition = 'center';
    background.style.backgroundRepeat = 'no-repeat';
    background.style.transition = 'opacity 0.5s ease';

    // 开始加载
    loadRandomBackground();
}

// 使用示例（可在页面加载时调用）
window.addEventListener('DOMContentLoaded', setRandomBackground);

// 每小时自动更换背景
setInterval(setRandomBackground, 60 * 60 * 1000);

// 点击背景更换图片（可选）
document.querySelector('.background').addEventListener('click', setRandomBackground);

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
    if (grid) {
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
    }

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
            
            // 随机间隔 1.5s 到 3.5s，让由于网络波动造成的数值跳动看起来“此起彼伏”
            const nextDelay = Math.floor(Math.random() * 2000) + 1500; 
            setTimeout(loop, nextDelay);
        };
        
        // 错峰启动，防止页面刚加载时瞬间卡顿
        setTimeout(loop, Math.random() * 1000);
    });
}

// 8. 极速预加载控制 (System Initialization - Turbo Mode)
// 修正逻辑：DOM 准备好立刻显示，不再等待所有资源加载完毕
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('preloader');
    
    // 300ms 极短缓冲，仅为了平滑过渡，消除 1.5s 的人为卡顿
    setTimeout(function() {
        loader.classList.add('hidden');
        
        // 动画结束后彻底移除元素，释放内存
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); 
    }, 300); 
});

// 兜底策略：以防 DOMContentLoaded 未触发
window.addEventListener('load', function() {
    const loader = document.getElementById('preloader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
});

// 初始化
setFixedBackground(); // 改名调用新函数：设置固定背景
setInterval(updateClock, 1000);
updateClock();
fetchHitokoto();
fetchWeather();
fetchGithubStars();
checkNetworkStatus(); // 启动网络监测

console.log(
    "%c Six's Terminal %c System Ready ",
    "background:#06b6d4; color:#000; font-weight:bold; border-radius: 4px 0 0 4px; padding: 4px;",
    "background:#0f172a; color:#06b6d4; font-weight:bold; border: 1px solid #06b6d4; border-radius: 0 4px 4px 0; padding: 3px;"
);
