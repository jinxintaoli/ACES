// 超简单的 ACES 应用 - 无模块依赖
console.log('ACES 简单版本加载...');

function initializeApp() {
    console.log('开始初始化应用...');

    const mainContent = document.getElementById('main-content');
    const loadingSpinner = document.querySelector('.loading-spinner');

    // 检查元素是否存在
    if (!mainContent) {
        console.error('错误: 找不到 #main-content 元素');
        return;
    }

    // 直接加载仪表板
    fetch('./pages/dashboard.html')
        .then(response => {
            if (!response.ok) throw new Error('HTTP错误: ' + response.status);
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            console.log('ACES 应用加载完成');

            // 手动触发 DOMContentLoaded 事件，确保 dashboard 中的脚本执行
            setTimeout(() => {
                if (document.readyState === 'complete') {
                    window.dispatchEvent(new Event('DOMContentLoaded'));
                }
            }, 100);
        })
        .catch(error => {
            console.error('加载失败:', error);
            // 显示基础内容
            mainContent.innerHTML = `
                <div style="padding: 20px;">
                    <h2>ACES 平台</h2>
                    <p>欢迎使用信息学竞赛万能引擎</p>
                    <div style="margin-top: 20px;">
                        <button onclick="showSection('editor')" style="padding: 10px; margin: 5px;">代码编辑器</button>
                        <button onclick="showSection('algorithms')" style="padding: 10px; margin: 5px;">算法库</button>
                        <button onclick="showSection('cpp')" style="padding: 10px; margin: 5px;">C++ 知识</button>
                    </div>
                </div>
            `;
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        });
}

// 等待 DOM 加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// 简单的导航功能
window.showSection = function(section) {
    alert('导航到: ' + section);
};