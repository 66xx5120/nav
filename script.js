// 1. 实时时钟
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });
    document.getElementById('clock').textContent = timeString;
    
    // 动态问候语
    const hour = now.getHours();
    let greeting = "你好";
    if (hour < 6) greeting = "夜深了，注意休息";
    else if (hour < 11) greeting = "早上好！";
    else if (hour < 14) greeting = "中午好，记得吃饭";
    else if (hour < 18) greeting = "下午好，喝杯茶吧";
    else greeting = "晚上好，享受时光";
    
    document.getElementById('greeting').innerText = greeting;
}
setInterval(updateClock, 1000);
updateClock();

// 2. 一言 API (获取随机二次元/文学句子)
fetch('https://v1.hitokoto.cn/?c=a&c=b')
    .then(response => response.json())
    .then(data => {
        const hitokoto = document.getElementById('hitokoto_text');
        hitokoto.innerText = `${data.hitokoto} —— ${data.from}`;
    })
    .catch(console.error);

// 3. 搜索功能 (默认使用 Google，可改为 Baidu)
function doSearch() {
    const query = document.getElementById('search-input').value;
    if (query) {
        // 这里的链接可以换成 https://www.baidu.com/s?wd=
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
}

// 绑定回车键搜索
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        doSearch();
    }
});