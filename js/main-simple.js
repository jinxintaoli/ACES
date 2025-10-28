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
        const chapterContent = getChapterContent(chapter);
        contentDiv.innerHTML = chapterContent;
    }
}

function getChapterContent(chapter) {
    const chapters = {
        '1': {
            title: '第1章 预备知识',
            content: `
                <h4>第1章 预备知识</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>C++简介</li>
                        <li>C++的起源</li>
                        <li>可移植性和标准</li>
                        <li>程序创建的技巧</li>
                        <li>面向对象编程</li>
                        <li>泛型编程</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>第一个C++程序：</h5>
                    <div class="code-block">
// myfirst.cpp
#include &lt;iostream&gt;

int main() {
    using namespace std;
    cout << "Come up and C++ me some time.";
    cout << endl;
    cout << "You won't regret it!" << endl;
    return 0;
}
                    </div>
                </div>
                <div class="key-points">
                    <h5>关键概念：</h5>
                    <ul>
                        <li><strong>main()函数</strong>：每个C++程序都必须包含main()函数</li>
                        <li><strong>#include编译指令</strong>：使iostream文件的内容可用</li>
                        <li><strong>using namespace</strong>：使用std名称空间</li>
                        <li><strong>cout</strong>：用于输出的对象</li>
                        <li><strong>&lt;&lt;运算符</strong>：将字符串插入到输出流中</li>
                    </ul>
                </div>
            `
        },
        '2': {
            title: '第2章 开始学习C++',
            content: `
                <h4>第2章 开始学习C++</h4>
                <div class="chapter-section">
                    <h5>C++程序的基本结构：</h5>
                    <ul>
                        <li>注释：// 和 /* */</li>
                        <li>预处理器编译指令 #include</li>
                        <li>函数头：int main()</li>
                        <li>函数体：用{}括起来</li>
                        <li>using编译指令</li>
                        <li>return语句</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>示例程序：</h5>
                    <div class="code-block">
// carrots.cpp
#include &lt;iostream&gt;

int main() {
    using namespace std;

    int carrots;            // 声明一个整型变量

    carrots = 25;           // 给变量赋值
    cout << "I have ";
    cout << carrots;        // 显示变量的值
    cout << " carrots.";
    cout << endl;

    carrots = carrots - 1;  // 修改变量的值
    cout << "Crunch, crunch. Now I have " << carrots << " carrots." << endl;
    return 0;
}
                    </div>
                </div>
                <div class="key-points">
                    <h5>重要概念：</h5>
                    <ul>
                        <li><strong>变量声明</strong>：int carrots;</li>
                        <li><strong>赋值语句</strong>：carrots = 25;</li>
                        <li><strong>cout的多重输出</strong>：cout &lt;&lt; a &lt;&lt; b &lt;&lt; c;</li>
                        <li><strong>endl控制符</strong>：重起一行</li>
                        <li><strong>cin输入</strong>：cin >> carrots;</li>
                    </ul>
                </div>
            `
        },
        '3': {
            title: '第3章 处理数据',
            content: `
                <h4>第3章 处理数据</h4>
                <div class="chapter-section">
                    <h5>C++数据类型：</h5>
                    <ul>
                        <li><strong>基本类型</strong>：
                            <ul>
                                <li>整型：short, int, long, long long</li>
                                <li>字符型：char, wchar_t</li>
                                <li>布尔型：bool</li>
                                <li>浮点型：float, double, long double</li>
                            </ul>
                        </li>
                        <li><strong>复合类型</strong>：数组、字符串、指针、结构等</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>数据类型示例：</h5>
                    <div class="code-block">
// limits.cpp
#include &lt;iostream&gt;
#include &lt;climits&gt;

int main() {
    using namespace std;

    int n_int = INT_MAX;        // 整型的最大值
    short n_short = SHRT_MAX;   // short的最大值
    long n_long = LONG_MAX;     // long的最大值
    long long n_llong = LLONG_MAX; // long long的最大值

    cout << "int is " << sizeof(int) << " bytes." << endl;
    cout << "short is " << sizeof n_short << " bytes." << endl;
    cout << "long is " << sizeof n_long << " bytes." << endl;
    cout << "long long is " << sizeof n_llong << " bytes." << endl;

    cout << "Maximum values:" << endl;
    cout << "int: " << n_int << endl;
    cout << "short: " << n_short << endl;
    cout << "long: " << n_long << endl;
    cout << "long long: " << n_llong << endl;

    return 0;
}
                    </div>
                </div>
                <div class="key-points">
                    <h5>关键知识点：</h5>
                    <ul>
                        <li><strong>sizeof运算符</strong>：返回类型或变量的长度</li>
                        <li><strong> climits头文件</strong>：包含符号常量</li>
                        <li><strong>初始化</strong>：int owls = 101; 或 int owls(101);</li>
                        <li><strong>无符号类型</strong>：unsigned short, unsigned int等</li>
                        <li><strong>const限定符</strong>：定义符号常量</li>
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
                        <li>结构</li>
                        <li>共用体</li>
                        <li>枚举</li>
                        <li>指针</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>数组和字符串示例：</h5>
                    <div class="code-block">
// array.cpp
#include &lt;iostream&gt;

int main() {
    using namespace std;

    // 数组示例
    int yams[3];        // 创建包含3个元素的数组
    yams[0] = 7;        // 为第一个元素赋值
    yams[1] = 8;
    yams[2] = 6;

    int yamcosts[3] = {20, 30, 5}; // 创建并初始化数组

    cout << "Total yams = ";
    cout << yams[0] + yams[1] + yams[2] << endl;

    // 字符串示例
    char dog[8] = {'b', 'e', 'a', 'u', 'x', ' ', 'I', 'I'}; // 不是字符串
    char cat[8] = {'f', 'a', 't', 'e', 's', 's', 'a', '\\0'}; // 是字符串

    cout << dog << endl;  // 可能不会正常显示
    cout << cat << endl;  // 正常显示

    return 0;
}
                    </div>
                </div>
                <div class="key-points">
                    <h5>重要概念：</h5>
                    <ul>
                        <li><strong>数组声明</strong>：typeName arrayName[arraySize];</li>
                        <li><strong>字符串</strong>：以空字符\\0结尾的字符序列</li>
                        <li><strong>结构</strong>：struct inflatable { char name[20]; float volume; double price; };</li>
                        <li><strong>共用体</strong>：一次只能存储一个值</li>
                        <li><strong>枚举</strong>：enum spectrum { red, orange, yellow, green };</li>
                    </ul>
                </div>
            `
        },
        '5': {
            title: '第5章 循环和关系表达式',
            content: `
                <h4>第5章 循环和关系表达式</h4>
                <div class="chapter-section">
                    <h5>循环类型：</h5>
                    <ul>
                        <li>for循环</li>
                        <li>while循环</li>
                        <li>do while循环</li>
                        <li>基于范围的for循环（C++11）</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>循环示例：</h5>
                    <div class="code-block">
// forloop.cpp
#include &lt;iostream&gt;

int main() {
    using namespace std;

    // for循环示例
    cout << "Counting forward:\\n";
    for (int i = 0; i < 10; i++)
        cout << i << " ";

    cout << "\\nCounting backward:\\n";
    for (int i = 9; i >= 0; i--)
        cout << i << " ";

    cout << "\\nCounting by fives:\\n";
    for (int i = 0; i <= 50; i += 5)
        cout << i << " ";

    // while循环示例
    char ch;
    int count = 0;
    cout << "\\nEnter characters; enter # to quit:\\n";
    cin >> ch;
    while (ch != '#') {
        cout << ch;
        count++;
        cin >> ch;
    }
    cout << endl << count << " characters read\\n";

    return 0;
}
                    </div>
                </div>
                <div class="key-points">
                    <h5>关键概念：</h5>
                    <ul>
                        <li><strong>for循环语法</strong>：for(init; test; update) statement</li>
                        <li><strong>递增递减运算符</strong>：++i（前缀）和 i++（后缀）</li>
                        <li><strong>组合赋值运算符</strong>：+=, -=, *=, /=, %=</li>
                        <li><strong>关系运算符</strong>：<, <=, ==, >=, >, !=</li>
                        <li><strong>逻辑运算符</strong>：&&, ||, !</li>
                    </ul>
                </div>
            `
        }
        // 其他章节的内容可以类似添加...
    };

    // 如果章节不存在，返回默认内容
    if (chapters[chapter]) {
        return chapters[chapter].content;
    } else {
        return `
            <h4>第${chapter}章</h4>
            <p>这是第${chapter}章的详细内容...</p>
            <div class="code-block">
// 第${chapter}章示例代码
#include &lt;iostream&gt;
using namespace std;

int main() {
    cout << "学习第${chapter}章" << endl;
    return 0;
}
            </div>
        `;
    }
}
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