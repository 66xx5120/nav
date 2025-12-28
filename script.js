// 1. 随机二次元背景 (防缓存优化版)
function setRandomBackground() {
    // 使用保罗API，质量较高，涵盖风景和动漫人物
    const baseUrl = "https://api.paugram.com/wallpaper/";
    
    // 也可以试试这个纯动漫的接口 (如果上面那个挂了，把下面这行前面的 // 去掉，把上面那行加上 //)
    // const baseUrl = "https://t.mwm.moe/pc"; 

    // 添加时间戳，强制浏览器每次刷新都去请求新图片，而不是读缓存
    const timestamp = new Date().getTime();
    const finalUrl = `${baseUrl}?t=${timestamp}`;

    const background = document.querySelector('.background');
    
    // 创建图片对象预加载，等图片下载完了再显示，防止背景变白
    const img = new Image();
    img.src = finalUrl;
    
    img.onload = function() {
        background.style.backgroundImage = `url('${finalUrl}')`;
    };
}

// 2. 实时时钟与问候
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });
    document.getElementById('clock').textContent = timeString;
    
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

// 3. 一言 API (获取随机句子)
function fetchHitokoto() {
    fetch('https://v1.hitokoto.cn/?c=a&c=b') // a=动画, b=漫画
        .then(response => response.json())
        .then(data => {
            const hitokoto = document.getElementById('hitokoto_text');
            hitokoto.innerText = `${data.hitokoto} —— ${data.from}`;
        })
        .catch(() => {
            document.getElementById('hitokoto_text').innerText = "今天的风儿甚是喧嚣...";
        });
}

// 4. 搜索功能 (默认Google)
function doSearch() {
    const query = document.getElementById('search-input').value;
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
}

// 绑定回车键
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') doSearch();
});

// === 初始化执行 ===
setRandomBackground(); // 加载背景
setInterval(updateClock, 1000); // 启动时钟
updateClock(); // 立即显示时间
fetchHitokoto(); // 获取句子