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
${'#include'} &lt;iostream&gt;

int main() {
    using namespace std;
    cout << "Come up and C++ me some time.";
    cout << endl;
    cout << "You won't regret it!" << endl;
    return 0;
}
                    </div>
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
            `
        },
        // 第3-9章保持原有内容不变...
        '10': {
            title: '第10章 对象和类',
            content: `
                <h4>第10章 对象和类</h4>
                <div class="chapter-section">
                    <h5>主要内容：</h5>
                    <ul>
                        <li>10.1 过程性编程和面向对象编程</li>
                        <li>10.2 抽象和类
                            <ul>
                                <li>10.2.1 类型是什么</li>
                                <li>10.2.2 C++中的类</li>
                                <li>10.2.3 实现类成员函数</li>
                                <li>10.2.4 使用类</li>
                                <li>10.2.5 修改类</li>
                                <li>10.2.6 小结</li>
                            </ul>
                        </li>
                        <li>10.3 类的构造函数和析构函数
                            <ul>
                                <li>10.3.1 声明和定义构造函数</li>
                                <li>10.3.2 使用构造函数</li>
                                <li>10.3.3 默认构造函数</li>
                                <li>10.3.4 析构函数</li>
                                <li>10.3.5 改进Stock类</li>
                                <li>10.3.6 构造函数和析构函数小结</li>
                            </ul>
                        </li>
                        <li>10.4 this指针</li>
                        <li>10.5 对象数组</li>
                        <li>10.6 类作用域
                            <ul>
                                <li>10.6.1 作用域为类的常量</li>
                                <li>10.6.2 作用域内枚举（C++11）</li>
                            </ul>
                        </li>
                        <li>10.7 抽象数据类型</li>
                        <li>10.8 总结</li>
                        <li>10.9 复习题</li>
                        <li>10.10 编程练习</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>类定义示例：</h5>
                    <div class="code-block">
// stock00.h
${'#ifndef'} STOCK00_H_
${'#define'} STOCK00_H_

${'#include'} &lt;string&gt;

class Stock {
private:
    std::string company;
    long shares;
    double share_val;
    double total_val;
    void set_tot() { total_val = shares * share_val; }

public:
    Stock();        // 默认构造函数
    Stock(const std::string & co, long n = 0, double pr = 0.0);
    ~Stock();       // 析构函数
    void buy(long num, double price);
    void sell(long num, double price);
    void update(double price);
    void show();
};

${'#endif'}
                    </div>
                </div>
                <div class="key-points">
                    <h5>关键概念：</h5>
                    <ul>
                        <li><strong>类</strong>：将数据表示和操纵数据的方法组合成一个整洁的包</li>
                        <li><strong>构造函数</strong>：在创建对象时自动调用的特殊成员函数</li>
                        <li><strong>析构函数</strong>：在对象删除时自动调用的特殊成员函数</li>
                        <li><strong>this指针</strong>：指向调用成员函数的对象</li>
                        <li><strong>类作用域</strong>：在类中定义的名称的作用域为整个类</li>
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
                        <li>11.1 运算符重载</li>
                        <li>11.2 计算时间：一个运算符重载示例
                            <ul>
                                <li>11.2.1 添加加法运算符</li>
                                <li>11.2.2 重载限制</li>
                                <li>11.2.3 其他重载运算符</li>
                            </ul>
                        </li>
                        <li>11.3 友元
                            <ul>
                                <li>11.3.1 创建友元</li>
                                <li>11.3.2 常用的友元：重载&lt;&lt;运算符</li>
                            </ul>
                        </li>
                        <li>11.4 重载运算符：作为成员函数还是非成员函数</li>
                        <li>11.5 再谈重载：一个矢量类</li>
                        <li>11.6 使用状态成员</li>
                        <li>11.7 为Vector类重载算术运算符</li>
                        <li>11.8 对实现的说明</li>
                        <li>11.9 使用Vector类来模拟随机行走</li>
                        <li>11.10 类的自动转换和强制类型转换</li>
                        <li>11.11 转换函数</li>
                        <li>11.12 转换函数和友元函数</li>
                        <li>11.13 总结</li>
                        <li>11.14 复习题</li>
                        <li>11.15 编程练习</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>运算符重载示例：</h5>
                    <div class="code-block">
// mytime0.h
${'#ifndef'} MYTIME0_H_
${'#define'} MYTIME0_H_

class Time {
private:
    int hours;
    int minutes;
public:
    Time();
    Time(int h, int m = 0);
    void AddMin(int m);
    void AddHr(int h);
    void Reset(int h = 0, int m = 0);
    Time operator+(const Time & t) const;
    void Show() const;
};

${'#endif'}
                    </div>
                </div>
                <div class="key-points">
                    <h5>关键概念：</h5>
                    <ul>
                        <li><strong>运算符重载</strong>：将运算符重载为成员函数或非成员函数</li>
                        <li><strong>友元函数</strong>：可以访问类的私有成员的普通函数</li>
                        <li><strong>转换函数</strong>：将类对象转换为其他类型</li>
                        <li><strong>自动类型转换</strong>：通过构造函数实现的隐式类型转换</li>
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
                        <li>12.1 动态内存和类
                            <ul>
                                <li>12.1.1 复习示例和静态类成员</li>
                                <li>12.1.2 特殊成员函数</li>
                                <li>12.1.3 回到StringBad：复制构造函数哪里出了问题</li>
                                <li>12.1.4 StringBad的其他问题：赋值运算符</li>
                            </ul>
                        </li>
                        <li>12.2 改进后的新String类
                            <ul>
                                <li>12.2.1 修改后的默认构造函数</li>
                                <li>12.2.2 比较成员函数</li>
                                <li>12.2.3 使用中括号表示法访问字符串</li>
                                <li>12.2.4 静态成员函数</li>
                                <li>12.2.5 进一步重载赋值运算符</li>
                            </ul>
                        </li>
                        <li>12.3 在构造函数中使用new时应注意的事项</li>
                        <li>12.4 有关返回对象的说明
                            <ul>
                                <li>12.4.1 返回指向const对象的引用</li>
                                <li>12.4.2 返回指向非const对象的引用</li>
                                <li>12.4.3 返回对象</li>
                                <li>12.4.4 返回const对象</li>
                            </ul>
                        </li>
                        <li>12.5 使用指向对象的指针
                            <ul>
                                <li>12.5.1 再谈new和delete</li>
                                <li>12.5.2 指针和对象小结</li>
                                <li>12.5.3 再谈定位new运算符</li>
                            </ul>
                        </li>
                        <li>12.6 复习各种技术
                            <ul>
                                <li>12.6.1 重载&lt;&lt;运算符</li>
                                <li>12.6.2 转换函数</li>
                                <li>12.6.3 其构造函数使用new的类</li>
                            </ul>
                        </li>
                        <li>12.7 队列模拟
                            <ul>
                                <li>12.7.1 队列类</li>
                                <li>12.7.2 Customer类</li>
                                <li>12.7.3 ATM模拟</li>
                            </ul>
                        </li>
                        <li>12.8 总结</li>
                        <li>12.9 复习题</li>
                        <li>12.10 编程练习</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>动态内存分配示例：</h5>
                    <div class="code-block">
// string1.h
${'#ifndef'} STRING1_H_
${'#define'} STRING1_H_

${'#include'} &lt;iostream&gt;
using std::ostream;
using std::istream;

class String {
private:
    char * str;
    int len;
    static int num_strings;
    static const int CINLIM = 80;
public:
    String(const char * s);
    String();
    String(const String &);
    ~String();
    int length() const { return len; }

    String & operator=(const String &);
    String & operator=(const char *);
    char & operator[](int i);
    const char & operator[](int i) const;

    friend bool operator<(const String &st1, const String &st2);
    friend bool operator>(const String &st1, const String &st2);
    friend bool operator==(const String &st1, const String &st2);
    friend ostream & operator<<(ostream & os, const String & st);
    friend istream & operator>>(istream & is, String & st);

    static int HowMany();
};

${'#endif'}
                    </div>
                </div>
                <div class="key-points">
                    <h5>关键概念：</h5>
                    <ul>
                        <li><strong>动态内存分配</strong>：在程序运行时分配内存</li>
                        <li><strong>复制构造函数</strong>：用于将一个对象复制到新创建的对象中</li>
                        <li><strong>静态类成员</strong>：无论创建多少个对象，程序都只创建一个静态类变量副本</li>
                        <li><strong>定位new运算符</strong>：让您能够指定要使用的位置</li>
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
                        <li>13.1 一个简单的基类
                            <ul>
                                <li>13.1.1 派生一个类</li>
                                <li>13.1.2 构造函数：访问权限的考虑</li>
                                <li>13.1.3 使用派生类</li>
                                <li>13.1.4 派生类和基类之间的特殊关系</li>
                            </ul>
                        </li>
                        <li>13.2 继承：is-a关系</li>
                        <li>13.3 多态公有继承</li>
                        <li>13.4 静态联编和动态联编</li>
                        <li>13.5 访问控制：protected</li>
                        <li>13.6 抽象基类</li>
                        <li>13.7 继承和动态内存分配</li>
                        <li>13.8 类设计回顾</li>
                        <li>13.9 总结</li>
                        <li>13.10 复习题</li>
                        <li>13.11 编程练习</li>
                    </ul>
                </div>
                <div class="code-example">
                    <h5>类继承示例：</h5>
                    <div class="code-block">
// tabtenn0.h
${'#ifndef'} TABTENN0_H_
${'#define'} TABTENN0_H_

${'#include'} &lt;string&gt;
using std::string;

class TableTennisPlayer {
private:
    string firstname;
    string lastname;
    bool hasTable;
public:
    TableTennisPlayer(const string & fn = "none",
                     const string & ln = "none", bool ht = false);
    void Name() const;
    bool HasTable() const { return hasTable; }
    void ResetTable(bool v) { hasTable = v; }
};

class RatedPlayer : public TableTennisPlayer {
private:
    unsigned int rating;
public:
    RatedPlayer(unsigned int r = 0, const string & fn = "none",
               const string & ln = "none", bool ht = false);
    RatedPlayer(unsigned int r, const TableTennisPlayer & tp);
    unsigned int Rating() const { return rating; }
    void ResetRating(unsigned int r) { rating = r; }
};

${'#endif'}
                    </div>
                </div>
                <div class="key-points">
                    <h5>关键概念：</h5>
                    <ul>
                        <li><strong>类继承</strong>：从已有的类派生出新的类</li>
                        <li><strong>多态</strong>：同一个方法的行为随上下文而异</li>
                        <li><strong>虚函数</strong>：在派生类中重新定义基类的方法</li>
                        <li><strong>抽象基类</strong>：包含纯虚函数的类，不能创建对象</li>
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
                        <li>14.1 包含对象成员的类</li>
                        <li>14.2 私有继承</li>
                        <li>14.3 多重继承</li>
                        <li>14.4 类模板</li>
                        <li>14.5 总结</li>
                        <li>14.6 复习题</li>
                        <li>14.7 编程练习</li>
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
                        <li>15.1 友元</li>
                        <li>15.2 异常</li>
                        <li>15.3 RTTI（运行阶段类型识别）</li>
                        <li>15.4 类型转换运算符</li>
                        <li>15.5 总结</li>
                        <li>15.6 复习题</li>
                        <li>15.7 编程练习</li>
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
                        <li>16.1 string类</li>
                        <li>16.2 智能指针</li>
                        <li>16.3 标准模板库</li>
                        <li>16.4 泛型编程</li>
                        <li>16.5 函数对象</li>
                        <li>16.6 算法</li>
                        <li>16.7 其他库</li>
                        <li>16.8 总结</li>
                        <li>16.9 复习题</li>
                        <li>16.10 编程练习</li>
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
                        <li>17.1 C++输入和输出概述</li>
                        <li>17.2 使用cout进行输出</li>
                        <li>17.3 使用cin进行输入</li>
                        <li>17.4 文件输入和输出</li>
                        <li>17.5 内核格式化</li>
                        <li>17.6 总结</li>
                        <li>17.7 复习题</li>
                        <li>17.8 编程练习</li>
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
                        <li>18.1 C++11功能</li>
                        <li>18.2 移动语义和右值引用</li>
                        <li>18.3 新的类功能</li>
                        <li>18.4 Lambda函数</li>
                        <li>18.5 包装器</li>
                        <li>18.6 可变参数模板</li>
                        <li>18.7 C++11新增的其他功能</li>
                        <li>18.8 语言变化</li>
                        <li>18.9 总结</li>
                        <li>18.10 复习题</li>
                        <li>18.11 编程练习</li>
                    </ul>
                </div>
            `
        }
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
${'#include'} &lt;iostream&gt;
using namespace std;

int main() {
    cout << "学习第${chapter}章" << endl;
    return 0;
}
            </div>
        `;
    }
}

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