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
            // 插入 HTML 内容
            mainContent.innerHTML = html;

            // 隐藏加载状态
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }

            console.log('ACES 应用加载完成');

            // 手动执行 dashboard 中的脚本
            executeDashboardScripts();
        })
        .catch(error => {
            console.error('加载失败:', error);
            // 显示基础内容
            mainContent.innerHTML = getBasicContent();
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        });
}

// 执行 dashboard 中的脚本功能
function executeDashboardScripts() {
    console.log('执行仪表板脚本...');

    // 直接在这里定义导航功能，而不是依赖 dashboard.html 中的脚本
    setupNavigationEvents();
}

// 定义导航事件处理函数
function setupNavigationEvents() {
    console.log('设置导航事件...');

    // 绑定系统导航点击事件
    const navItems = document.querySelectorAll('.component-list li');
    console.log('找到导航项:', navItems.length);

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            console.log('导航点击:', url);
            handleNavigation(url);
        });
    });

    // 绑定章节点击事件
    const chapterItems = document.querySelectorAll('.chapter-item');
    chapterItems.forEach(item => {
        item.addEventListener('click', function() {
            const chapter = this.getAttribute('data-chapter');
            console.log('章节点击:', chapter);
            showChapterContent(chapter);
        });
    });

    // 绑定算法点击事件
    const algoItems = document.querySelectorAll('.algorithm-item');
    algoItems.forEach(item => {
        item.addEventListener('click', function() {
            const algo = this.getAttribute('data-algo');
            console.log('算法点击:', algo);
            showAlgorithmDetails(algo);
        });
    });

    // 绑定标签页切换事件
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('标签页切换:', tabId);
            switchTab(tabId);
        });
    });
}

// 导航处理函数
function handleNavigation(url) {
    console.log('处理导航:', url);

    // 简单的导航处理
    switch(url) {
        case '/cpp':
            showCPPKnowledge();
            break;
        case '/algorithms':
            showAlgorithms();
            break;
        case '/editor':
            showCodeEditor();
            break;
        case '/analysis':
            showAnalysis();
            break;
        default:
            console.log('未知导航:', url);
            alert('功能开发中: ' + url);
    }
}

function showCPPKnowledge() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>C++ 知识点</h2>
            <p>C++ 编程语言相关知识内容</p>
            <div class="card">
                <h3>基础语法</h3>
                <p>变量、数据类型、运算符等</p>
            </div>
            <div class="card">
                <h3>面向对象</h3>
                <p>类、对象、继承、多态</p>
            </div>
            <button onclick="location.reload()" style="padding: 10px; margin: 10px;">返回仪表板</button>
        </div>
    `;
}

function showAlgorithms() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>算法库</h2>
            <p>常用算法和数据结构</p>
            <div class="algorithm-grid">
                <div class="algorithm-item" onclick="showAlgorithmDetails('DFS')">DFS</div>
                <div class="algorithm-item" onclick="showAlgorithmDetails('BFS')">BFS</div>
                <div class="algorithm-item" onclick="showAlgorithmDetails('DP')">动态规划</div>
                <div class="algorithm-item" onclick="showAlgorithmDetails('Sort')">排序算法</div>
            </div>
            <button onclick="location.reload()" style="padding: 10px; margin: 10px;">返回仪表板</button>
        </div>
    `;
}

function showCodeEditor() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>代码编辑器</h2>
            <p>在线代码编辑和调试环境</p>
            <textarea style="width: 100%; height: 300px; font-family: monospace;" placeholder="在这里编写代码..."></textarea>
            <div style="margin-top: 10px;">
                <button style="padding: 10px; margin: 5px;">运行代码</button>
                <button style="padding: 10px; margin: 5px;">调试</button>
                <button onclick="location.reload()" style="padding: 10px; margin: 5px;">返回仪表板</button>
            </div>
        </div>
    `;
}

function showAnalysis() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>学习分析</h2>
            <p>学习进度和性能分析</p>
            <div class="card">
                <h3>学习进度</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 65%;"></div>
                </div>
                <p>总体进度: 65%</p>
            </div>
            <button onclick="location.reload()" style="padding: 10px; margin: 10px;">返回仪表板</button>
        </div>
    `;
}

function showChapterContent(chapter) {
    const contentDiv = document.getElementById('chapter-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <h4>第 ${chapter} 章</h4>
            <p>这是第 ${chapter} 章的详细内容...</p>
            <div class="code-block">
// 第 ${chapter} 章示例代码
#include &lt;iostream&gt;
using namespace std;

int main() {
    cout << "学习第 ${chapter} 章" << endl;
    return 0;
}
            </div>
        `;
    }
}

function showAlgorithmDetails(algo) {
    const infoDiv = document.getElementById('component-info');
    if (infoDiv) {
        const algoInfo = {
            'DFS': '深度优先搜索 - 用于遍历或搜索树或图的算法',
            'BFS': '广度优先搜索 - 层层扩展的搜索算法',
            'DP': '动态规划 - 通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法',
            'Sort': '排序算法 - 将数据按照特定顺序排列的算法'
        };

        infoDiv.innerHTML = `
            <h4>${algo} 算法</h4>
            <p>${algoInfo[algo] || '算法详细信息'}</p>
            <button class="debug-btn" onclick="showAlgorithms()">学习更多</button>
        `;
    }
}

function switchTab(tabId) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 移除所有标签激活状态
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // 显示选中的标签内容
    const targetContent = document.getElementById(`${tabId}-content`);
    const targetTab = document.querySelector(`.tab[data-tab="${tabId}"]`);

    if (targetContent) targetContent.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
}

function getBasicContent() {
    return `
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