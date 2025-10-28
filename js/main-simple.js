# 创建全新的 main-simple.js 文件
cat > js/main-simple.js << 'EOF'
// ACES 应用 - 简化稳定版本
console.log('ACES 应用开始加载...');

// 应用初始化
function initializeApp() {
    console.log('初始化应用...');
    
    const mainContent = document.getElementById('main-content');
    const loadingSpinner = document.querySelector('.loading-spinner');
    
    if (!mainContent) {
        console.error('错误: 找不到 #main-content 元素');
        return;
    }
    
    // 加载仪表板
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
            console.log('应用加载完成');
            setupDashboardEvents();
        })
        .catch(error => {
            console.error('加载失败:', error);
            mainContent.innerHTML = getBasicContent();
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        });
}

// 设置仪表板事件
function setupDashboardEvents() {
    console.log('设置仪表板事件...');
    
    // 导航项点击事件
    const navItems = document.querySelectorAll('.component-list li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            handleNavigation(url);
        });
    });
    
    // 章节点击事件
    const chapterItems = document.querySelectorAll('.chapter-item');
    chapterItems.forEach(item => {
        item.addEventListener('click', function() {
            const chapter = this.getAttribute('data-chapter');
            showChapterContent(chapter);
        });
    });
    
    // 算法点击事件
    const algoItems = document.querySelectorAll('.algorithm-item');
    algoItems.forEach(item => {
        item.addEventListener('click', function() {
            const algo = this.getAttribute('data-algo');
            showAlgorithmDetails(algo);
        });
    });
    
    // 标签页切换
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

// 导航处理
function handleNavigation(url) {
    console.log('导航到:', url);
    
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
            alert('功能开发中: ' + url);
    }
}

// 显示章节内容
function showChapterContent(chapter) {
    const contentDiv = document.getElementById('chapter-content');
    if (contentDiv) {
        contentDiv.innerHTML = getChapterContent(chapter);
    }
}

// 获取章节内容
function getChapterContent(chapter) {
    const chapterData = {
        '1': {
            title: '第1章 预备知识',
            content: 'C++简介、起源、可移植性和标准、程序创建技巧'
        },
        '2': {
            title: '第2章 开始学习C++', 
            content: 'C++程序基本结构、注释、预处理器指令、函数'
        },
        '3': {
            title: '第3章 处理数据',
            content: 'C++数据类型、整型、字符型、布尔型、浮点型'
        },
        '4': {
            title: '第4章 复合类型',
            content: '数组、字符串、结构、共用体、枚举、指针'
        },
        '5': {
            title: '第5章 循环和关系表达式',
            content: 'for循环、while循环、do while循环、关系表达式'
        },
        '6': {
            title: '第6章 分支语句和逻辑运算符',
            content: 'if语句、switch语句、逻辑运算符'
        },
        '7': {
            title: '第7章 函数——C++的编程模块',
            content: '函数定义、函数原型、函数参数、返回值'
        },
        '8': {
            title: '第8章 函数探幽',
            content: '内联函数、引用变量、默认参数、函数重载'
        },
        '9': {
            title: '第9章 内存模型和名称空间',
            content: '单独编译、存储持续性、作用域、链接性'
        },
        '10': {
            title: '第10章 对象和类',
            content: '面向对象编程、类声明、类实现、构造函数、析构函数'
        },
        '11': {
            title: '第11章 使用类',
            content: '运算符重载、友元函数、转换函数'
        },
        '12': {
            title: '第12章 类和动态内存分配',
            content: '动态内存分配、复制构造函数、赋值运算符'
        },
        '13': {
            title: '第13章 类继承',
            content: '基类与派生类、多态公有继承、虚函数'
        },
        '14': {
            title: '第14章 C++中的代码重用',
            content: '包含对象成员的类、私有继承、多重继承、类模板'
        },
        '15': {
            title: '第15章 友元、异常和其他',
            content: '友元类、异常处理、RTTI、类型转换运算符'
        },
        '16': {
            title: '第16章 string类和标准模板库',
            content: 'string类、智能指针、STL、泛型编程'
        },
        '17': {
            title: '第17章 输入、输出和文件',
            content: 'C++ I/O概述、使用cout输出、使用cin输入、文件I/O'
        },
        '18': {
            title: '第18章 探讨C++新标准',
            content: 'C++11功能、移动语义、Lambda函数、可变参数模板'
        }
    };
    
    const data = chapterData[chapter] || { title: '第' + chapter + '章', content: '内容加载中...' };
    
    return `
        <h4>${data.title}</h4>
        <div class="chapter-section">
            <h5>主要内容：</h5>
            <p>${data.content}</p>
        </div>
        <div class="key-points">
            <h5>学习要点：</h5>
            <ul>
                <li>理解基本概念</li>
                <li>掌握语法规则</li>
                <li>完成练习题目</li>
                <li>实际编程应用</li>
            </ul>
        </div>
    `;
}

// 其他功能函数
function showAlgorithmDetails(algo) {
    const infoDiv = document.getElementById('component-info');
    if (infoDiv) {
        const algoInfo = {
            'DFS': '深度优先搜索 - 用于遍历或搜索树或图的算法',
            'BFS': '广度优先搜索 - 层层扩展的搜索算法', 
            'DP': '动态规划 - 通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法'
        };
        
        infoDiv.innerHTML = `
            <h4>${algo} 算法</h4>
            <p>${algoInfo[algo] || '算法详细信息'}</p>
        `;
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetContent = document.getElementById(tabId + '-content');
    const targetTab = document.querySelector('.tab[data-tab="' + tabId + '"]');
    
    if (targetContent) targetContent.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
}

function showCPPKnowledge() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>C++ 知识点</h2>
            <p>选择左侧章节查看详细内容</p>
        </div>
    `;
}

function showAlgorithms() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>算法库</h2>
            <p>常用算法和数据结构学习</p>
        </div>
    `;
}

function showCodeEditor() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>代码编辑器</h2>
            <p>在线代码编辑和调试环境</p>
        </div>
    `;
}

function showAnalysis() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>学习分析</h2>
            <p>学习进度和性能分析</p>
        </div>
    `;
}

function getBasicContent() {
    return `
        <div style="padding: 20px;">
            <h2>ACES 平台</h2>
            <p>欢迎使用信息学竞赛万能引擎</p>
            <div style="margin-top: 20px;">
                <button onclick="showCPPKnowledge()" style="padding: 10px; margin: 5px;">C++ 知识</button>
                <button onclick="showAlgorithms()" style="padding: 10px; margin: 5px;">算法库</button>
                <button onclick="showCodeEditor()" style="padding: 10px; margin: 5px;">代码编辑器</button>
            </div>
        </div>
    `;
}

// 启动应用
document.addEventListener('DOMContentLoaded', initializeApp);
EOF