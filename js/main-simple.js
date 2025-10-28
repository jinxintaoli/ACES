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
// 显示章节内容
function showChapterContent(chapter) {
    var contentDiv = document.getElementById('chapter-content');
    if (contentDiv) {
        var chapterContent = getDetailedChapterContent(chapter);
        contentDiv.innerHTML = chapterContent;
    }
}

// 获取详细的章节内容
function getDetailedChapterContent(chapter) {
    var chapterData = {
        '1': {
            title: '第1章 预备知识',
            content: `
                <h4>第1章 预备知识</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>C++简介</li>
                        <li>C++的起源：与C语言的关系</li>
                        <li>可移植性和标准</li>
                        <li>程序创建的技巧</li>
                        <li>面向对象编程</li>
                        <li>泛型编程</li>
                        <li>程序创建的步骤</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '2': {
            title: '第2章 开始学习C++',
            content: `
                <h4>第2章 开始学习C++</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>进入C++</li>
                        <li>C++语句</li>
                        <li>其他C++语句</li>
                        <li>函数</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '3': {
            title: '第3章 处理数据',
            content: `
                <h4>第3章 处理数据</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>简单变量</li>
                        <li>整型</li>
                        <li>C++11初始化方式</li>
                        <li>无符号类型</li>
                        <li>选择整型类型</li>
                        <li>整型字面值</li>
                        <li>char类型：字符和小整数</li>
                        <li>bool类型</li>
                        <li>const限定符</li>
                        <li>浮点数</li>
                        <li>C++算术运算符</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '4': {
            title: '第4章 复合类型',
            content: `
                <h4>第4章 复合类型</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>数组</li>
                        <li>字符串</li>
                        <li>string类简介</li>
                        <li>结构简介</li>
                        <li>共用体</li>
                        <li>枚举</li>
                        <li>指针和自由存储空间</li>
                        <li>指针、数组和指针算术</li>
                        <li>组合类型</li>
                        <li>数组的替代品</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '5': {
            title: '第5章 循环和关系表达式',
            content: `
                <h4>第5章 循环和关系表达式</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>for循环</li>
                        <li>while循环</li>
                        <li>do while循环</li>
                        <li>基于范围的for循环（C++11）</li>
                        <li>循环和文本输入</li>
                        <li>嵌套循环和二维数组</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '6': {
            title: '第6章 分支语句和逻辑运算符',
            content: `
                <h4>第6章 分支语句和逻辑运算符</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>if语句</li>
                        <li>逻辑表达式</li>
                        <li>字符函数库cctype</li>
                        <li>?:运算符</li>
                        <li>switch语句</li>
                        <li>break和continue语句</li>
                        <li>读取数字的循环</li>
                        <li>简单文件输入/输出</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '7': {
            title: '第7章 函数——C++的编程模块',
            content: `
                <h4>第7章 函数——C++的编程模块</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>函数的基本知识</li>
                        <li>函数原型</li>
                        <li>按值传递函数参数</li>
                        <li>函数和数组</li>
                        <li>函数和二维数组</li>
                        <li>函数和C-风格字符串</li>
                        <li>函数和结构</li>
                        <li>函数和string对象</li>
                        <li>递归</li>
                        <li>函数指针</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '8': {
            title: '第8章 函数探幽',
            content: `
                <h4>第8章 函数探幽</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>C++内联函数</li>
                        <li>引用变量</li>
                        <li>默认参数</li>
                        <li>函数重载</li>
                        <li>函数模板</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '9': {
            title: '第9章 内存模型和名称空间',
            content: `
                <h4>第9章 内存模型和名称空间</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>单独编译</li>
                        <li>存储持续性、作用域和链接性</li>
                        <li>名称空间</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '10': {
            title: '第10章 对象和类',
            content: `
                <h4>第10章 对象和类</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>过程性编程和面向对象编程</li>
                        <li>抽象和类</li>
                        <li>类的构造函数和析构函数</li>
                        <li>this指针</li>
                        <li>对象数组</li>
                        <li>类作用域</li>
                        <li>抽象数据类型</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '11': {
            title: '第11章 使用类',
            content: `
                <h4>第11章 使用类</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>运算符重载</li>
                        <li>计算时间：一个运算符重载示例</li>
                        <li>友元</li>
                        <li>重载运算符：作为成员函数还是非成员函数</li>
                        <li>再谈重载：一个矢量类</li>
                        <li>类的自动转换和强制类型转换</li>
                        <li>转换函数</li>
                        <li>转换函数和友元函数</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '12': {
            title: '第12章 类和动态内存分配',
            content: `
                <h4>第12章 类和动态内存分配</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>动态内存和类</li>
                        <li>改进后的新String类</li>
                        <li>在构造函数中使用new时应注意的事项</li>
                        <li>有关返回对象的说明</li>
                        <li>使用指向对象的指针</li>
                        <li>复习各种技术</li>
                        <li>队列模拟</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '13': {
            title: '第13章 类继承',
            content: `
                <h4>第13章 类继承</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>一个简单的基类</li>
                        <li>继承：is-a关系</li>
                        <li>多态公有继承</li>
                        <li>静态联编和动态联编</li>
                        <li>访问控制：protected</li>
                        <li>抽象基类</li>
                        <li>继承和动态内存分配</li>
                        <li>类设计回顾</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '14': {
            title: '第14章 C++中的代码重用',
            content: `
                <h4>第14章 C++中的代码重用</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>包含对象成员的类</li>
                        <li>私有继承</li>
                        <li>多重继承</li>
                        <li>类模板</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '15': {
            title: '第15章 友元、异常和其他',
            content: `
                <h4>第15章 友元、异常和其他</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>友元</li>
                        <li>异常</li>
                        <li>RTTI（运行阶段类型识别）</li>
                        <li>类型转换运算符</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '16': {
            title: '第16章 string类和标准模板库',
            content: `
                <h4>第16章 string类和标准模板库</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>string类</li>
                        <li>智能指针</li>
                        <li>标准模板库</li>
                        <li>泛型编程</li>
                        <li>函数对象</li>
                        <li>算法</li>
                        <li>其他库</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '17': {
            title: '第17章 输入、输出和文件',
            content: `
                <h4>第17章 输入、输出和文件</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>C++输入和输出概述</li>
                        <li>使用cout进行输出</li>
                        <li>使用cin进行输入</li>
                        <li>文件输入和输出</li>
                        <li>内核格式化</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        },
        '18': {
            title: '第18章 探讨C++新标准',
            content: `
                <h4>第18章 探讨C++新标准</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>C++11功能回顾</li>
                        <li>移动语义和右值引用</li>
                        <li>新的类功能</li>
                        <li>Lambda函数</li>
                        <li>包装器</li>
                        <li>可变参数模板</li>
                        <li>C++11新增的其他功能</li>
                        <li>语言变化</li>
                        <li>总结</li>
                    </ul>
                </div>
            `
        }
    };

    var data = chapterData[chapter];
    if (data) {
        return data.content;
    } else {
        return '<h4>第' + chapter + '章</h4><p>这是第' + chapter + '章的详细内容...</p>';
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
// 显示章节内容
function showChapterContent(chapter) {
    var contentDiv = document.getElementById('chapter-content');
    if (contentDiv) {
        var chapterContent = getDetailedChapterContent(chapter);
        contentDiv.innerHTML = chapterContent;
    }
}

// 获取详细的章节内容
function getDetailedChapterContent(chapter) {
    var chapterData = {
        '1': {
            title: '第1章 预备知识',
            content: '<h4>第1章 预备知识</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>C++简介</li><li>C++的起源：与C语言的关系</li><li>可移植性和标准</li><li>程序创建的技巧</li><li>面向对象编程</li><li>泛型编程</li><li>程序创建的步骤</li><li>总结</li></ul></div>'
        },
        '2': {
            title: '第2章 开始学习C++',
            content: '<h4>第2章 开始学习C++</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>进入C++</li><li>C++语句</li><li>其他C++语句</li><li>函数</li><li>总结</li></ul></div>'
        },
        '3': {
            title: '第3章 处理数据',
            content: '<h4>第3章 处理数据</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>简单变量</li><li>整型</li><li>C++11初始化方式</li><li>无符号类型</li><li>选择整型类型</li><li>整型字面值</li><li>char类型：字符和小整数</li><li>bool类型</li><li>const限定符</li><li>浮点数</li><li>C++算术运算符</li><li>总结</li></ul></div>'
        },
        '4': {
            title: '第4章 复合类型',
            content: '<h4>第4章 复合类型</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>数组</li><li>字符串</li><li>string类简介</li><li>结构简介</li><li>共用体</li><li>枚举</li><li>指针和自由存储空间</li><li>指针、数组和指针算术</li><li>组合类型</li><li>数组的替代品</li><li>总结</li></ul></div>'
        },
        '5': {
            title: '第5章 循环和关系表达式',
            content: '<h4>第5章 循环和关系表达式</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>for循环</li><li>while循环</li><li>do while循环</li><li>基于范围的for循环（C++11）</li><li>循环和文本输入</li><li>嵌套循环和二维数组</li><li>总结</li></ul></div>'
        },
        '6': {
            title: '第6章 分支语句和逻辑运算符',
            content: '<h4>第6章 分支语句和逻辑运算符</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>if语句</li><li>逻辑表达式</li><li>字符函数库cctype</li><li>?:运算符</li><li>switch语句</li><li>break和continue语句</li><li>读取数字的循环</li><li>简单文件输入/输出</li><li>总结</li></ul></div>'
        },
        '7': {
            title: '第7章 函数——C++的编程模块',
            content: '<h4>第7章 函数——C++的编程模块</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>函数的基本知识</li><li>函数原型</li><li>按值传递函数参数</li><li>函数和数组</li><li>函数和二维数组</li><li>函数和C-风格字符串</li><li>函数和结构</li><li>函数和string对象</li><li>递归</li><li>函数指针</li><li>总结</li></ul></div>'
        },
        '8': {
            title: '第8章 函数探幽',
            content: '<h4>第8章 函数探幽</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>C++内联函数</li><li>引用变量</li><li>默认参数</li><li>函数重载</li><li>函数模板</li><li>总结</li></ul></div>'
        },
        '9': {
            title: '第9章 内存模型和名称空间',
            content: '<h4>第9章 内存模型和名称空间</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>单独编译</li><li>存储持续性、作用域和链接性</li><li>名称空间</li><li>总结</li></ul></div>'
        },
        '10': {
            title: '第10章 对象和类',
            content: '<h4>第10章 对象和类</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>过程性编程和面向对象编程</li><li>抽象和类</li><li>类的构造函数和析构函数</li><li>this指针</li><li>对象数组</li><li>类作用域</li><li>抽象数据类型</li><li>总结</li></ul></div>'
        },
        '11': {
            title: '第11章 使用类',
            content: '<h4>第11章 使用类</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>运算符重载</li><li>计算时间：一个运算符重载示例</li><li>友元</li><li>重载运算符：作为成员函数还是非成员函数</li><li>再谈重载：一个矢量类</li><li>类的自动转换和强制类型转换</li><li>转换函数</li><li>转换函数和友元函数</li><li>总结</li></ul></div>'
        },
        '12': {
            title: '第12章 类和动态内存分配',
            content: '<h4>第12章 类和动态内存分配</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>动态内存和类</li><li>改进后的新String类</li><li>在构造函数中使用new时应注意的事项</li><li>有关返回对象的说明</li><li>使用指向对象的指针</li><li>复习各种技术</li><li>队列模拟</li><li>总结</li></ul></div>'
        },
        '13': {
            title: '第13章 类继承',
            content: '<h4>第13章 类继承</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>一个简单的基类</li><li>继承：is-a关系</li><li>多态公有继承</li><li>静态联编和动态联编</li><li>访问控制：protected</li><li>抽象基类</li><li>继承和动态内存分配</li><li>类设计回顾</li><li>总结</li></ul></div>'
        },
        '14': {
            title: '第14章 C++中的代码重用',
            content: '<h4>第14章 C++中的代码重用</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>包含对象成员的类</li><li>私有继承</li><li>多重继承</li><li>类模板</li><li>总结</li></ul></div>'
        },
        '15': {
            title: '第15章 友元、异常和其他',
            content: '<h4>第15章 友元、异常和其他</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>友元</li><li>异常</li><li>RTTI（运行阶段类型识别）</li><li>类型转换运算符</li><li>总结</li></ul></div>'
        },
        '16': {
            title: '第16章 string类和标准模板库',
            content: '<h4>第16章 string类和标准模板库</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>string类</li><li>智能指针</li><li>标准模板库</li><li>泛型编程</li><li>函数对象</li><li>算法</li><li>其他库</li><li>总结</li></ul></div>'
        },
        '17': {
            title: '第17章 输入、输出和文件',
            content: '<h4>第17章 输入、输出和文件</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>C++输入和输出概述</li><li>使用cout进行输出</li><li>使用cin进行输入</li><li>文件输入和输出</li><li>内核格式化</li><li>总结</li></ul></div>'
        },
        '18': {
            title: '第18章 探讨C++新标准',
            content: '<h4>第18章 探讨C++新标准</h4><div class=\"chapter-section\"><h5>主要内容：</h5><ul><li>C++11功能回顾</li><li>移动语义和右值引用</li><li>新的类功能</li><li>Lambda函数</li><li>包装器</li><li>可变参数模板</li><li>C++11新增的其他功能</li><li>语言变化</li><li>总结</li></ul></div>'
        }
    };
    
    var data = chapterData[chapter];
    if (data) {
        return data.content;
    } else {
        return '<h4>第' + chapter + '章</h4><p>这是第' + chapter + '章的详细内容...</p>';
    }
}
