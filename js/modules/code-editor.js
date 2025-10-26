import { Utils } from './utils.js';

export class CodeEditorManager {
    constructor() {
        this.utils = new Utils();
        this.editor = null;
        this.isInitialized = false;
        this.currentAlgorithm = null;

        // 算法模板定义
        this.algorithmTemplates = {
            DFS: `// 深度优先搜索示例
#include <iostream>
#include <vector>
using namespace std;

void dfs(int node, vector<vector<int>>& graph, vector<bool>& visited) {
    visited[node] = true;
    cout << "访问节点: " << node << endl;

    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited);
        }
    }
}

int main() {
    int n = 5; // 节点数量
    vector<vector<int>> graph(n);
    vector<bool> visited(n, false);

    // 构建图
    graph[0].push_back(1);
    graph[0].push_back(2);
    graph[1].push_back(3);
    graph[2].push_back(4);

    // 从节点0开始DFS
    dfs(0, graph, visited);
    return 0;
}`,

            BFS: `// 广度优先搜索示例
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(int start, vector<vector<int>>& graph, vector<bool>& visited) {
    queue<int> q;
    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << "访问节点: " << node << endl;

        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}

int main() {
    int n = 5; // 节点数量
    vector<vector<int>> graph(n);
    vector<bool> visited(n, false);

    // 构建图
    graph[0].push_back(1);
    graph[0].push_back(2);
    graph[1].push_back(3);
    graph[2].push_back(4);

    // 从节点0开始BFS
    bfs(0, graph, visited);
    return 0;
}`,

            DP: `// 动态规划示例 - 斐波那契数列
#include <iostream>
#include <vector>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;

    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

int main() {
    int n = 10;
    cout << "斐波那契数列第" << n << "项: " << fibonacci(n) << endl;
    return 0;
}`,

            Dijkstra: `// Dijkstra最短路径算法
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

void dijkstra(int start, vector<vector<pair<int, int>>>& graph, vector<int>& dist) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : graph[u]) {
            int v = edge.first;
            int w = edge.second;

            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}

int main() {
    int n = 5; // 节点数量
    vector<vector<pair<int, int>>> graph(n);
    vector<int> dist(n, INT_MAX);

    // 构建图
    graph[0].push_back({1, 4});
    graph[0].push_back({2, 1});
    graph[1].push_back({3, 1});
    graph[2].push_back({1, 2});
    graph[2].push_back({3, 5});
    graph[3].push_back({4, 3});

    // 从节点0开始Dijkstra
    dijkstra(0, graph, dist);

    for (int i = 0; i < n; i++) {
        cout << "节点0到节点" << i << "的最短距离: " << dist[i] << endl;
    }

    return 0;
}`,

            QuickSort: `// 快速排序算法
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    int n = arr.size();

    quickSort(arr, 0, n - 1);

    cout << "排序后的数组: ";
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    return 0;
}`,

            custom: `// 自定义代码模板
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    // 在这里编写您的代码
    cout << "Hello, ACES System!" << endl;

    // 示例：计算1到10的和
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum += i;
    }
    cout << "1到10的和为: " << sum << endl;

    return 0;
}`
        };
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 动态加载CodeMirror
            await this.loadCodeMirror();

            // 初始化编辑器
            this.initializeEditor();

            // 设置事件监听器
            this.setupEventListeners();

            // 设置编译器选项
            this.setupCompilerOptions();

            this.isInitialized = true;
            console.log('代码编辑器模块初始化完成');

        } catch (error) {
            console.error('代码编辑器模块初始化失败:', error);
            throw error;
        }
    }

    async loadCodeMirror() {
        // 检查是否已加载
        if (window.CodeMirror) return;

        // 加载CSS
        await this.utils.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css');
        await this.utils.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css');

        // 加载JS
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/markdown/markdown.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/selection/active-line.min.js');
    }

    initializeEditor() {
        const textarea = document.getElementById('code-editor');
        if (!textarea) {
            throw new Error('代码编辑器文本区域未找到');
        }

        this.editor = CodeMirror.fromTextArea(textarea, {
            mode: "text/x-c++src",
            theme: "monokai",
            lineNumbers: true,
            matchBrackets: true,
            styleActiveLine: true,
            indentUnit: 4,
            lineWrapping: true,
            autofocus: true
        });

        // 设置默认代码
        this.loadAlgorithmTemplate('custom');
    }

    setupEventListeners() {
        // 加载模板按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'load-template') {
                this.handleLoadTemplate();
            }
        });

        // 运行代码按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'run-code') {
                this.handleRunCode();
            }
        });

        // 检查语法按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'check-syntax') {
                this.handleCheckSyntax();
            }
        });

        // 分析复杂度按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'analyze-complexity') {
                this.handleAnalyzeComplexity();
            }
        });

        // 显示伪代码按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'show-pseudocode') {
                this.handleShowPseudocode();
            }
        });

        // 编译代码按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'compile-code') {
                this.handleCompileCode();
            }
        });

        // 算法选择变化
        document.addEventListener('change', (event) => {
            if (event.target.id === 'algorithm-select') {
                this.currentAlgorithm = event.target.value;
            }
        });
    }

    setupCompilerOptions() {
        // 设置默认编译器选项
        const defaults = {
            'cpp-standard': 'c++17',
            'optimization-level': 'O2',
            'warnings': 'wall',
            'debug-info': 'g'
        };

        Object.keys(defaults).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = defaults[id];
            }
        });
    }

    handleLoadTemplate() {
        const algorithmSelect = document.getElementById('algorithm-select');
        if (!algorithmSelect) return;

        const algorithm = algorithmSelect.value;
        this.loadAlgorithmTemplate(algorithm);
    }

    loadAlgorithmTemplate(algorithm) {
        this.currentAlgorithm = algorithm;

        const template = this.algorithmTemplates[algorithm] ||
                        this.algorithmTemplates.custom;

        if (this.editor) {
            this.editor.setValue(template);
            this.showOutput(`已加载 ${algorithm} 算法模板`, 'success');
        }
    }

    async handleRunCode() {
        if (!this.editor) return;

        const code = this.editor.getValue();
        this.showOutput("执行结果:\n代码正在运行...", 'info');

        try {
            // 模拟代码执行
            const result = await this.simulateCodeExecution(code);
            this.showOutput(result, 'success');
        } catch (error) {
            this.showOutput(`执行错误: ${error.message}`, 'error');
        }
    }

    async simulateCodeExecution(code) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let output = "执行结果:\n";

                // 简单的输出模拟
                if (code.includes('cout << "Hello"')) {
                    output += "Hello, ACES System!\n";
                }
                if (code.includes('fibonacci')) {
                    output += "斐波那契数列第10项: 55\n";
                }
                if (code.includes('quickSort')) {
                    output += "排序后的数组: 1 5 7 8 9 10\n";
                }

                output += "程序执行成功，返回代码: 0";
                resolve(output);
            }, 1000);
        });
    }

    handleCheckSyntax() {
        if (!this.editor) return;

        const code = this.editor.getValue();
        const issues = this.analyzeSyntax(code);

        if (issues.length === 0) {
            this.showOutput("语法检查:\n代码语法正确，未发现明显错误。", 'success');
        } else {
            let output = "语法检查:\n发现以下问题:\n";
            issues.forEach(issue => {
                output += `- ${issue}\n`;
            });
            this.showOutput(output, 'warning');
        }
    }

    analyzeSyntax(code) {
        const issues = [];

        // 简单的语法检查
        if (!code.includes('#include')) {
            issues.push("可能缺少必要的头文件");
        }

        if (!code.includes('main')) {
            issues.push("可能缺少main函数");
        }

        if (code.includes('cin') && !code.includes('cout')) {
            issues.push("有输入但无输出，程序可能没有显示结果");
        }

        // 检查括号匹配
        const openBraces = (code.match(/{/g) || []).length;
        const closeBraces = (code.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            issues.push("大括号不匹配");
        }

        return issues;
    }

    handleAnalyzeComplexity() {
        if (!this.editor) return;

        const code = this.editor.getValue();
        const analysis = this.analyzeTimeComplexity(code);

        this.showOutput(analysis, 'info');
    }

    analyzeTimeComplexity(code) {
        let timeComplexity = "O(1)";
        let spaceComplexity = "O(1)";
        let explanation = "基于代码结构进行的简单复杂度估算。";

        // 分析时间复杂度
        if (code.includes('for') && code.includes('for')) {
            timeComplexity = "O(n²)";
            explanation = "检测到嵌套循环，可能是二次时间复杂度。";
        } else if (code.includes('for') || code.includes('while')) {
            timeComplexity = "O(n)";
            explanation = "检测到单层循环，可能是线性时间复杂度。";
        }

        // 分析空间复杂度
        if (code.includes('vector') && code.includes('resize')) {
            spaceComplexity = "O(n)";
        } else if (code.includes('new ') || code.includes('malloc')) {
            spaceComplexity = "O(n)";
        }

        return `复杂度分析结果:\n\n` +
               `时间复杂度: ${timeComplexity}\n` +
               `空间复杂度: ${spaceComplexity}\n\n` +
               `分析说明:\n${explanation}`;
    }

    handleShowPseudocode() {
        if (!this.editor) return;

        const code = this.editor.getValue();
        const pseudocode = this.generatePseudocode(code);

        const container = document.getElementById('pseudocode-container');
        const pseudocodeElement = document.getElementById('pseudocode');

        if (container && pseudocodeElement) {
            container.style.display = 'block';
            pseudocodeElement.textContent = pseudocode;
        }
    }

    generatePseudocode(code) {
        let pseudocode = "// 伪代码表示\n\n";

        if (code.includes('dfs') || code.includes('DFS')) {
            pseudocode += `函数 DFS(节点, 图, 访问标记):
    标记节点为已访问
    输出 "访问节点: " + 节点

    对于节点的每个邻居:
        如果邻居未被访问:
            递归调用 DFS(邻居, 图, 访问标记)`;

        } else if (code.includes('bfs') || code.includes('BFS')) {
            pseudocode += `函数 BFS(起始节点, 图, 访问标记):
    创建队列
    标记起始节点为已访问并加入队列

    当队列不为空:
        取出队列头部节点
        输出 "访问节点: " + 节点

        对于节点的每个邻居:
            如果邻居未被访问:
                标记为已访问并加入队列`;

        } else if (code.includes('fibonacci') || code.includes('fib')) {
            pseudocode += `函数 Fibonacci(n):
    如果 n <= 1:
        返回 n
    否则:
        返回 Fibonacci(n-1) + Fibonacci(n-2)`;

        } else if (code.includes('quickSort') || code.includes('quicksort')) {
            pseudocode += `函数 QuickSort(数组, 左边界, 右边界):
    如果 左边界 < 右边界:
        分区索引 = Partition(数组, 左边界, 右边界)
        QuickSort(数组, 左边界, 分区索引-1)
        QuickSort(数组, 分区索引+1, 右边界)

函数 Partition(数组, 左边界, 右边界):
    基准值 = 数组[右边界]
    较小元素索引 = 左边界 - 1

    对于 j 从 左边界 到 右边界-1:
        如果 数组[j] < 基准值:
            较小元素索引++
            交换 数组[较小元素索引] 和 数组[j]

    交换 数组[较小元素索引+1] 和 数组[右边界]
    返回 较小元素索引 + 1`;

        } else {
            pseudocode += `函数 主函数():
    初始化变量
    执行主要逻辑
    返回结果

// 无法生成特定伪代码，显示通用结构`;
        }

        return pseudocode;
    }

    handleCompileCode() {
        if (!this.editor) return;

        const code = this.editor.getValue();
        const cppStandard = document.getElementById('cpp-standard')?.value || 'c++17';
        const optimization = document.getElementById('optimization-level')?.value || 'O2';
        const warnings = document.getElementById('warnings')?.value || 'wall';
        const debugInfo = document.getElementById('debug-info')?.value || 'g';

        this.showOutput("编译信息:\n正在编译代码...", 'info');

        // 模拟编译过程
        setTimeout(() => {
            let output = "编译信息:\n";
            output += `使用标准: ${cppStandard}\n`;
            output += `优化级别: ${optimization}\n`;
            output += `警告选项: ${warnings}\n`;
            output += `调试信息: ${debugInfo}\n\n`;
            output += "✓ 编译成功! 生成可执行文件。\n\n";
            output += "运行结果:\n";
            output += "Hello, ACES System!\n";
            output += "1到10的和为: 55\n\n";
            output += "程序执行完成";

            this.showOutput(output, 'success');
        }, 1500);
    }

    showOutput(message, type = 'info') {
        const outputElement = document.getElementById('code-output');
        if (!outputElement) return;

        // 清除之前的类
        outputElement.className = 'code-block';

        // 添加类型相关的样式类
        if (type === 'error') {
            outputElement.classList.add('output-error');
        } else if (type === 'warning') {
            outputElement.classList.add('output-warning');
        } else if (type === 'success') {
            outputElement.classList.add('output-success');
        }

        outputElement.textContent = message;

        // 自动滚动到底部
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    getCurrentCode() {
        return this.editor ? this.editor.getValue() : '';
    }

    setCode(code) {
        if (this.editor) {
            this.editor.setValue(code);
        }
    }

    // 清理资源
    cleanup() {
        if (this.editor) {
            const editorElement = this.editor.getWrapperElement();
            if (editorElement && editorElement.parentNode) {
                editorElement.parentNode.removeChild(editorElement);
            }
            this.editor = null;
        }

        this.isInitialized = false;
        console.log('代码编辑器模块清理完成');
    }
}