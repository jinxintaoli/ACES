// 超简单的 ACES 应用 - 无模块依赖
console.log('ACES 简单版本加载...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 加载完成');

    // 直接加载仪表板
    fetch('./pages/dashboard.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            document.querySelector('.loading-spinner').style.display = 'none';
            console.log('ACES 应用加载完成');
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('main-content').innerHTML = `
                <div style="padding: 20px;">
                    <h2>ACES 平台</h2>
                    <p>欢迎使用信息学竞赛万能引擎</p>
                    <div>
                        <button onclick="showSection('editor')">代码编辑器</button>
                        <button onclick="showSection('algorithms')">算法库</button>
                        <button onclick="showSection('cpp')">C++ 知识</button>
                    </div>
                </div>
            `;
            document.querySelector('.loading-spinner').style.display = 'none';
        });
});

// 简单的导航功能
window.showSection = function(section) {
    alert('导航到: ' + section);
};