console.log('ACES loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready');
    var mainContent = document.getElementById('main-content');
    var loadingSpinner = document.querySelector('.loading-spinner');
    
    if (mainContent && loadingSpinner) {
        fetch('./pages/dashboard.html')
            .then(function(r) { return r.text(); })
            .then(function(html) {
                mainContent.innerHTML = html;
                loadingSpinner.style.display = 'none';
                
                // 添加导航事件绑定
                setupNavigationEvents();
            })
            .catch(function(e) {
                mainContent.innerHTML = '<h2>ACES Platform</h2><p>Basic version loaded</p>';
                loadingSpinner.style.display = 'none';
            });
    }
});

// 设置导航事件
function setupNavigationEvents() {
    console.log('Setting up navigation events');
    
    // 延迟执行，确保DOM已更新
    setTimeout(function() {
        // 绑定系统导航点击事件
        var navItems = document.querySelectorAll('.component-list li');
        console.log('Found navigation items:', navItems.length);
        
        navItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var url = this.getAttribute('data-url');
                console.log('Navigation clicked:', url);
                handleNavigation(url);
            });
        });

        // 绑定章节点击事件
        var chapterItems = document.querySelectorAll('.chapter-item');
        chapterItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var chapter = this.getAttribute('data-chapter');
                console.log('Chapter clicked:', chapter);
                showChapterContent(chapter);
            });
        });

        // 绑定算法点击事件
        var algoItems = document.querySelectorAll('.algorithm-item');
        algoItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var algo = this.getAttribute('data-algo');
                console.log('Algorithm clicked:', algo);
                showAlgorithmDetails(algo);
            });
        });

        // 绑定标签页切换事件
        var tabs = document.querySelectorAll('.tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var tabId = this.getAttribute('data-tab');
                console.log('Tab clicked:', tabId);
                switchTab(tabId);
            });
        });
    }, 100);
}

// 导航处理函数
function handleNavigation(url) {
    console.log('Handling navigation to:', url);
    
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
    var contentDiv = document.getElementById('chapter-content');
    if (contentDiv) {
        contentDiv.innerHTML = '<h4>第' + chapter + '章</h4><p>这是第' + chapter + '章的详细内容...</p>';
    }
}

// 显示算法详情
function showAlgorithmDetails(algo) {
    var infoDiv = document.getElementById('component-info');
    if (infoDiv) {
        var algoInfo = {
            'DFS': '深度优先搜索 - 用于遍历或搜索树或图的算法',
            'BFS': '广度优先搜索 - 层层扩展的搜索算法', 
            'DP': '动态规划 - 通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法'
        };
        
        infoDiv.innerHTML = '<h4>' + algo + ' 算法</h4><p>' + (algoInfo[algo] || '算法详细信息') + '</p>';
    }
}

// 切换标签页
function switchTab(tabId) {
    // 隐藏所有标签内容
    var tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function(content) {
        content.classList.remove('active');
    });
    
    // 移除所有标签激活状态
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });
    
    // 显示选中的标签内容
    var targetContent = document.getElementById(tabId + '-content');
    var targetTab = document.querySelector('.tab[data-tab=\"' + tabId + '\"]');
    
    if (targetContent) targetContent.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
}

// 页面导航函数
function showCPPKnowledge() {
    var content = document.getElementById('main-content');
    content.innerHTML = '<div style=\"padding:20px;\"><h2>C++ 知识点</h2><p>C++ 编程语言相关知识内容</p></div>';
}

function showAlgorithms() {
    var content = document.getElementById('main-content');
    content.innerHTML = '<div style=\"padding:20px;\"><h2>算法库</h2><p>常用算法和数据结构</p></div>';
}

function showCodeEditor() {
    var content = document.getElementById('main-content');
    content.innerHTML = '<div style=\"padding:20px;\"><h2>代码编辑器</h2><p>在线代码编辑和调试环境</p></div>';
}

function showAnalysis() {
    var content = document.getElementById('main-content');
    content.innerHTML = '<div style=\"padding:20px;\"><h2>学习分析</h2><p>学习进度和性能分析</p></div>';
}
