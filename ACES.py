from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# 扩展的ACES系统数据
aces_data = {
    "system_name": "ACES 系统 (信息学竞赛万能引擎)",
    "components": {
        "input": ["1.问题分析", "2.问题转化", "3.问题建模", "4.问题编码"],
        "ace_core": ["算法可行性评估", "计算效率评估", "时间复杂度评估", "空间复杂度评估", "系统稳定性评估"],
        "algorithms": ["深度优先搜索DFS", "广度优先搜索BFS", "动态规划DP", "滑动窗口Sliding Window"],
        "output": ["重新校验", "输出优化", "输出验证", "测试用例"]
    },
    "extended_algorithms": {
        "动态规划": [
            "背包问题 (0-1背包, 完全背包)",
            "最长公共子序列 (LCS)",
            "最长递增子序列 (LIS)",
            "矩阵链乘法",
            "编辑距离",
            "硬币找零问题",
            "区间DP",
            "树形DP",
            "状态压缩DP"
        ],
        "图算法": [
            "最短路径算法 (Dijkstra, Bellman-Ford, Floyd-Warshall)",
            "最小生成树 (Prim, Kruskal)",
            "拓扑排序",
            "强连通分量 (Kosaraju, Tarjan)",
            "网络流 (最大流, 最小割)",
            "二分图匹配",
            "欧拉回路",
            "哈密顿路径"
        ],
        "排序算法": [
            "快速排序",
            "归并排序",
            "堆排序",
            "计数排序",
            "基数排序",
            "桶排序",
            "拓扑排序",
            "外部排序"
        ],
        "搜索算法": [
            "二分查找",
            "深度优先搜索 (DFS)",
            "广度优先搜索 (BFS)",
            "A*搜索",
            "迭代加深搜索",
            "双向搜索",
            "启发式搜索"
        ],
        "数据结构": [
            "栈、队列、双端队列",
            "链表 (单向、双向、循环)",
            "树 (二叉树、二叉搜索树、AVL树、红黑树)",
            "堆 (二叉堆、斐波那契堆)",
            "哈希表",
            "并查集",
            "线段树",
            "树状数组",
            "Trie树",
            "跳表"
        ],
        "字符串算法": [
            "KMP算法",
            "Rabin-Karp算法",
            "后缀数组",
            "后缀自动机",
            "字典树",
            "AC自动机",
            "Manacher算法"
        ],
        "数论与数学": [
            "素数筛法",
            "欧几里得算法",
            "快速幂",
            "组合数学",
            "概率与期望",
            "矩阵快速幂",
            "高斯消元",
            "FFT/NTT"
        ],
        "几何算法": [
            "凸包算法",
            "旋转卡壳",
            "扫描线算法",
            "平面最近点对",
            "多边形面积",
            "点定位"
        ]
    },
    "ioi_knowledge": {
        "基础算法": ["枚举", "模拟", "递归", "分治", "贪心"],
        "数据结构": ["线性结构", "树形结构", "图形结构", "集合结构"],
        "算法设计": ["算法分析", "算法优化", "算法证明"],
        "数学基础": ["数论", "组合数学", "概率统计", "线性代数"],
        "编程技巧": ["调试技巧", "优化技巧", "代码规范"]
    },
    "cpp_chapters": {
        "第1章 预备知识": [
            "1.1 C++ 简介",
            "1.2 C++ 发展历史",
            "1.3 C++ 的亮点",
            "1.4 程序创建的步骤"
        ],
        "第2章 开始学习 C++": [
            "2.1 进入 C++ 世界",
            "2.2 C++ 语句",
            "2.3 其他 C++ 语句"
        ],
        "第3章 处理数据": [
            "3.1 变量名",
            "3.2 const 预处理",
            "3.3 枚举"
        ],
        "第4章 复合类型": [
            "4.1 数组",
            "4.2 指针",
            "4.3 引用",
            "4.4 结构体"
        ],
        "第5章 循环和关系表达式": [
            "5.1 for 循环",
            "5.2 while 循环",
            "5.3 do...while 循环"
        ],
        "第6章 分支语句和逻辑运算符": [
            "6.1 if 语句",
            "6.2 switch 语句",
            "6.3 逻辑运算符"
        ],
        "第7章 函数": [
            "7.1 函数的定义和调用",
            "7.2 函数参数和返回值",
            "7.3 函数的嵌套和递归"
        ],
        "第8章 内存模型和名称空间": [
            "8.1 内存模型",
            "8.2 名称空间"
        ],
        "第9章 对象和类": [
            "9.1 类和对象",
            "9.2 类的构造函数和析构函数",
            "9.3 类的成员函数"
        ],
        "第10章 运算符重载": [
            "10.1 运算符重载的概念",
            "10.2 常见运算符的重载"
        ],
        "第11章 使用类": [
            "11.1 类的基础知识",
            "11.2 类与结构体",
            "11.3 类的访问控制"
        ],
        "第12章 类和动态内存分配": [
            "12.1 动态内存分配",
            "12.2 类与动态内存分配",
            "12.3 智能指针"
        ],
        "第13章 类继承": [
            "13.1 一个简单的基类",
            "13.2 继承：is-a 关系",
            "13.3 聚合：has-a 关系"
        ],
        "第14章 模板": [
            "14.1 函数模板",
            "14.2 类模板",
            "14.3 模板类和模板函数的实现细节"
        ],
        "第15章 异常处理": [
            "15.1 异常处理基础",
            "15.2 try、throw 和 catch",
            "15.3 异常的安全性和资源管理"
        ],
        "第16章 string 类和标准模板库": [
            "16.1 string 类",
            "16.2 标准模板库（STL）",
            "16.3 模板类 vector"
        ],
        "第17章 输入、输出和文件": [
            "17.1 C++ 输入输出概述",
            "17.2 使用 cin 和 cout 进行输入输出",
            "17.3 文件输入输出"
        ]
    },
    "cpp_examples": {
        "DFS": """
// 深度优先搜索示例
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

int main.css() {
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
}
        """,
        "Dijkstra": """
// Dijkstra最短路径算法示例
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

void dijkstra(int start, vector<vector<pair<int, int>>>& graph, vector<int>& dist) {
    int n = graph.size();
    dist.assign(n, INT_MAX);
    dist[start] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
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

int main.css() {
    int n = 5; // 节点数量
    vector<vector<pair<int, int>>> graph(n);
    vector<int> dist(n);

    // 构建带权图
    graph[0].push_back({1, 4});
    graph[0].push_back({2, 1});
    graph[1].push_back({3, 1});
    graph[2].push_back({1, 2});
    graph[2].push_back({3, 5});
    graph[3].push_back({4, 3});

    // 从节点0开始Dijkstra
    dijkstra(0, graph, dist);

    for (int i = 0; i < n; i++) {
        cout << "节点 " << i << " 的最短距离: " << dist[i] << endl;
    }

    return 0;
}
        """,
        "QuickSort": """
// 快速排序示例
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
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

int main.css() {
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    int n = arr.size();

    cout << "排序前: ";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    quickSort(arr, 0, n - 1);

    cout << "排序后: ";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    return 0;
}
        """
    }
}


@app.route('/')
def index():
    return render_template('index.html', data=aces_data)


@app.route('/check_syntax', methods=['POST'])
def check_syntax():
    code = request.json.get('code', '')

    # 简单的语法检查（实际应用中可以使用更复杂的检查）
    syntax_errors = []

    # 检查基本的语法问题
    if 'include' not in code:
        syntax_errors.append("缺少头文件包含")

    if 'main.css' not in code:
        syntax_errors.append("缺少main函数")

    # 检查括号匹配
    if code.count('{') != code.count('}'):
        syntax_errors.append("花括号不匹配")

    if code.count('(') != code.count(')'):
        syntax_errors.append("圆括号不匹配")

    return jsonify({
        "valid": len(syntax_errors) == 0,
        "errors": syntax_errors
    })


@app.route('/analyze_complexity', methods=['POST'])
def analyze_complexity():
    code = request.json.get('code', '')

    # 简单的时间复杂度分析
    complexity = "O(1)"

    if 'for' in code or 'while' in code:
        # 检查嵌套循环
        for_count = code.count('for')
        while_count = code.count('while')

        if for_count + while_count > 1:
            # 检查是否有嵌套
            lines = code.split('\n')
            indent_level = 0
            max_nesting = 0

            for line in lines:
                if 'for' in line or 'while' in line:
                    indent_level += 1
                    max_nesting = max(max_nesting, indent_level)
                elif '}' in line:
                    indent_level = max(0, indent_level - 1)

            if max_nesting >= 2:
                complexity = f"O(n^{max_nesting})"
            else:
                complexity = "O(n)"

    # 简单的空间复杂度分析
    space_complexity = "O(1)"

    if 'vector' in code or 'new' in code:
        space_complexity = "O(n)"

    return jsonify({
        "time_complexity": complexity,
        "space_complexity": space_complexity
    })


@app.route('/debug_code', methods=['POST'])
def debug_code():
    code = request.json.get('code', '')
    breakpoints = request.json.get('breakpoints', [])

    # 简单的调试模拟
    debug_steps = []
    lines = code.split('\n')

    for i, line in enumerate(lines):
        if i in breakpoints:
            debug_steps.append({
                "line": i,
                "code": line,
                "variables": simulate_variables(line)
            })

    return jsonify({
        "steps": debug_steps
    })


def simulate_variables(line):
    # 简单的变量状态模拟
    variables = {}

    if '=' in line:
        parts = line.split('=')
        if len(parts) == 2:
            var_name = parts[0].strip()
            var_value = parts[1].strip().replace(';', '')
            variables[var_name] = var_value

    return variables


if __name__ == '__main__':
    app.run(debug=True)