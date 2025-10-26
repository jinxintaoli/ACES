import { Utils } from './utils.js';

export class AISolverManager {
    constructor() {
        this.utils = new Utils();
        this.isInitialized = false;
        this.solutionHistory = [];
        this.currentProblem = null;
        this.isSolving = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 设置事件监听器
            this.setupEventListeners();

            // 加载解决方案历史
            this.loadSolutionHistory();

            this.isInitialized = true;
            console.log('AI解题模块初始化完成');

        } catch (error) {
            console.error('AI解题模块初始化失败:', error);
            throw error;
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.id === 'solve-problem') {
                this.handleSolveProblem();
            } else if (event.target.id === 'clear-problem') {
                this.clearProblem();
            } else if (event.target.id === 'save-solution') {
                this.saveSolution();
            } else if (event.target.id === 'load-example') {
                this.loadExampleProblem();
            }
        });

        // 问题输入变化
        const problemInput = document.getElementById('problem-input');
        if (problemInput) {
            problemInput.addEventListener('input', this.utils.debounce(() => {
                this.analyzeProblemType();
            }, 500));
        }
    }

    async handleSolveProblem() {
        const problemInput = document.getElementById('problem-input');
        if (!problemInput) return;

        const problem = problemInput.value.trim();
        if (!problem) {
            this.showAIMessage('请输入问题描述', 'warning');
            return;
        }

        this.isSolving = true;
        this.currentProblem = problem;

        this.showLoadingState();
        this.disableSolveButton();

        try {
            const solution = await this.generateAISolution(problem);
            this.displaySolution(solution);
            this.addToHistory(problem, solution);

        } catch (error) {
            this.showAIMessage(`解题失败: ${error.message}`, 'error');
        } finally {
            this.isSolving = false;
            this.enableSolveButton();
        }
    }

    async generateAISolution(problem) {
        // 模拟AI解题过程 - 实际应用中会调用AI API
        return new Promise((resolve) => {
            setTimeout(() => {
                const analysis = this.analyzeProblem(problem);
                const solution = this.generateSolutionSteps(analysis);
                resolve(solution);
            }, 3000);
        });
    }

    analyzeProblem(problem) {
        const analysis = {
            type: 'unknown',
            difficulty: 'medium',
            keywords: [],
            constraints: [],
            expectedInput: '',
            expectedOutput: '',
            timeConstraint: '',
            spaceConstraint: ''
        };

        // 关键词分析
        const keywords = this.extractKeywords(problem);
        analysis.keywords = keywords;

        // 问题类型识别
        analysis.type = this.classifyProblemType(keywords);

        // 难度评估
        analysis.difficulty = this.assessDifficulty(problem, keywords);

        // 约束条件提取
        analysis.constraints = this.extractConstraints(problem);

        // 输入输出分析
        const ioAnalysis = this.analyzeInputOutput(problem);
        analysis.expectedInput = ioAnalysis.input;
        analysis.expectedOutput = ioAnalysis.output;

        // 复杂度约束
        analysis.timeConstraint = this.extractTimeConstraint(problem);
        analysis.spaceConstraint = this.extractSpaceConstraint(problem);

        return analysis;
    }

    extractKeywords(problem) {
        const keywordPatterns = {
            '排序': ['排序', '有序', '顺序', 'sort'],
            '搜索': ['搜索', '查找', '搜索', 'find', 'search'],
            '图': ['图', '节点', '边', '路径', 'graph', 'node', 'edge'],
            '树': ['树', '二叉树', '子树', 'tree', 'binary'],
            '动态规划': ['动态规划', 'DP', '状态转移', 'dynamic programming'],
            '贪心': ['贪心', '贪婪', 'greedy'],
            '回溯': ['回溯', '回溯法', 'backtrack'],
            '分治': ['分治', '分治法', 'divide and conquer'],
            '最短路径': ['最短路径', '最短距离', 'shortest path'],
            '最大': ['最大', '最多', '最长', 'max', 'maximum'],
            '最小': ['最小', '最少', '最短', 'min', 'minimum']
        };

        const foundKeywords = [];
        const lowerProblem = problem.toLowerCase();

        Object.entries(keywordPatterns).forEach(([category, patterns]) => {
            patterns.forEach(pattern => {
                if (lowerProblem.includes(pattern.toLowerCase())) {
                    foundKeywords.push(category);
                }
            });
        });

        return [...new Set(foundKeywords)]; // 去重
    }

    classifyProblemType(keywords) {
        const typeMapping = {
            '排序': 'sorting',
            '搜索': 'searching',
            '图': 'graph',
            '树': 'tree',
            '动态规划': 'dynamic-programming',
            '贪心': 'greedy',
            '回溯': 'backtracking',
            '分治': 'divide-conquer',
            '最短路径': 'graph-shortest-path'
        };

        for (const keyword of keywords) {
            if (typeMapping[keyword]) {
                return typeMapping[keyword];
            }
        }

        return 'general';
    }

    assessDifficulty(problem, keywords) {
        let score = 0;

        // 基于关键词的难度评估
        const difficultyKeywords = {
            'easy': ['简单', '基础', 'easy', 'basic'],
            'hard': ['困难', '复杂', 'hard', 'complex', '挑战', 'challenge']
        };

        const lowerProblem = problem.toLowerCase();
        if (difficultyKeywords.easy.some(kw => lowerProblem.includes(kw))) {
            score -= 1;
        }
        if (difficultyKeywords.hard.some(kw => lowerProblem.includes(kw))) {
            score += 1;
        }

        // 基于问题类型的难度评估
        const typeDifficulty = {
            'sorting': 1,
            'searching': 1,
            'greedy': 2,
            'divide-conquer': 2,
            'dynamic-programming': 3,
            'backtracking': 3,
            'tree': 2,
            'graph': 2,
            'graph-shortest-path': 3
        };

        const problemType = this.classifyProblemType(keywords);
        score += typeDifficulty[problemType] || 1;

        // 基于问题长度的粗略评估
        if (problem.length > 200) score += 1;
        if (problem.length > 500) score += 1;

        if (score <= 1) return 'easy';
        if (score <= 3) return 'medium';
        return 'hard';
    }

    extractConstraints(problem) {
        const constraints = [];
        const constraintPatterns = [
            /时间限制[：:]\s*(\d+)\s*ms/gi,
            /内存限制[：:]\s*(\d+)\s*MB/gi,
            /输入规模[：:]\s*(\d+)\s*[≤<=]\s*n\s*[≤<=]\s*(\d+)/gi,
            /要求时间复杂度[：:]\s*O\(([^)]+)\)/gi,
            /要求空间复杂度[：:]\s*O\(([^)]+)\)/gi
        ];

        constraintPatterns.forEach(pattern => {
            const matches = problem.matchAll(pattern);
            for (const match of matches) {
                constraints.push(match[0]);
            }
        });

        return constraints;
    }

    analyzeInputOutput(problem) {
        // 简单的输入输出格式分析
        const analysis = {
            input: '根据问题描述确定输入格式',
            output: '根据问题描述确定输出格式'
        };

        if (problem.includes('输入：')) {
            const inputMatch = problem.match(/输入：([^\n]+)/);
            if (inputMatch) analysis.input = inputMatch[1].trim();
        }

        if (problem.includes('输出：')) {
            const outputMatch = problem.match(/输出：([^\n]+)/);
            if (outputMatch) analysis.output = outputMatch[1].trim();
        }

        return analysis;
    }

    extractTimeConstraint(problem) {
        const timeMatch = problem.match(/时间限制[：:]\s*(\d+)\s*ms/);
        return timeMatch ? `${timeMatch[1]}ms` : '未指定';
    }

    extractSpaceConstraint(problem) {
        const spaceMatch = problem.match(/内存限制[：:]\s*(\d+)\s*MB/);
        return spaceMatch ? `${spaceMatch[1]}MB` : '未指定';
    }

    generateSolutionSteps(analysis) {
        const solution = {
            analysis: analysis,
            steps: [],
            algorithm: this.selectAlgorithm(analysis),
            complexity: this.estimateComplexity(analysis),
            codeTemplate: this.generateCodeTemplate(analysis),
            testCases: this.generateTestCases(analysis)
        };

        // 生成解题步骤
        solution.steps = this.generateProblemSolvingSteps(analysis, solution.algorithm);

        return solution;
    }

    selectAlgorithm(analysis) {
        const algorithmMapping = {
            'sorting': {
                'easy': '快速排序 (Quick Sort)',
                'medium': '归并排序 (Merge Sort)',
                'hard': '堆排序 (Heap Sort)'
            },
            'searching': {
                'easy': '线性搜索 (Linear Search)',
                'medium': '二分搜索 (Binary Search)',
                'hard': '深度优先搜索 (DFS)'
            },
            'graph': {
                'easy': '广度优先搜索 (BFS)',
                'medium': '深度优先搜索 (DFS)',
                'hard': 'Dijkstra 算法'
            },
            'dynamic-programming': {
                'easy': '斐波那契数列 DP',
                'medium': '背包问题 DP',
                'hard': '状态压缩 DP'
            }
        };

        const defaultAlgorithms = {
            'easy': '暴力解法',
            'medium': '优化解法',
            'hard': '高级算法'
        };

        const typeAlgorithms = algorithmMapping[analysis.type];
        if (typeAlgorithms) {
            return typeAlgorithms[analysis.difficulty] || typeAlgorithms.medium;
        }

        return defaultAlgorithms[analysis.difficulty] || defaultAlgorithms.medium;
    }

    estimateComplexity(analysis) {
        const complexityMapping = {
            'sorting': 'O(n log n)',
            'searching': 'O(log n)',
            'graph': 'O(V + E)',
            'dynamic-programming': 'O(n²)',
            'greedy': 'O(n log n)',
            'backtracking': 'O(2ⁿ)'
        };

        return complexityMapping[analysis.type] || 'O(n)';
    }

    generateCodeTemplate(analysis) {
        const templates = {
            'sorting': `// ${analysis.algorithm} 实现
void sort(vector<int>& arr) {
    // 实现排序算法
}`,
            'searching': `// ${analysis.algorithm} 实现
int search(vector<int>& arr, int target) {
    // 实现搜索算法
    return -1;
}`,
            'graph': `// ${analysis.algorithm} 实现
void traverse(vector<vector<int>>& graph, int start) {
    // 实现图遍历算法
}`,
            'dynamic-programming': `// ${analysis.algorithm} 实现
int solve(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 0);
    // 实现动态规划
    return dp[n-1];
}`
        };

        return templates[analysis.type] || `// ${analysis.algorithm} 实现
// 根据问题描述实现算法`;
    }

    generateTestCases(analysis) {
        const testCases = [];

        // 生成简单测试用例
        testCases.push({
            input: '示例输入',
            output: '预期输出',
            explanation: '测试用例说明'
        });

        // 根据问题类型生成特定测试用例
        if (analysis.type === 'sorting') {
            testCases.push({
                input: '[3, 1, 4, 1, 5, 9, 2, 6]',
                output: '[1, 1, 2, 3, 4, 5, 6, 9]',
                explanation: '普通数组排序'
            });
        } else if (analysis.type === 'searching') {
            testCases.push({
                input: '数组: [1, 3, 5, 7, 9], 目标: 5',
                output: '2',
                explanation: '在有序数组中查找元素'
            });
        }

        return testCases;
    }

    generateProblemSolvingSteps(analysis, algorithm) {
        const steps = [
            '1. 问题理解: 仔细阅读问题描述，明确输入输出格式和约束条件',
            `2. 算法选择: 选择 ${algorithm} 作为解决方案`,
            `3. 复杂度分析: 预计时间复杂度 ${analysis.complexity}`,
            '4. 思路设计: 设计算法的主要思路和关键步骤',
            '5. 代码实现: 根据算法思路编写代码',
            '6. 测试验证: 使用测试用例验证代码正确性',
            '7. 优化调整: 根据测试结果进行必要的优化'
        ];

        // 添加类型特定的步骤
        if (analysis.type === 'dynamic-programming') {
            steps.splice(3, 0, '3.1. 状态定义: 明确DP状态的含义');
            steps.splice(4, 0, '3.2. 状态转移: 推导状态转移方程');
        } else if (analysis.type === 'graph') {
            steps.splice(3, 0, '3.1. 图表示: 选择合适的图数据结构');
            steps.splice(4, 0, '3.2. 遍历策略: 确定图的遍历方式');
        }

        return steps;
    }

    displaySolution(solution) {
        const solutionElement = document.getElementById('solution-steps');
        if (!solutionElement) return;

        let solutionHTML = `
            <div class="solution-header">
                <h4>ACES 智能解题方案</h4>
                <div class="solution-meta">
                    <span class="problem-type">类型: ${solution.analysis.type}</span>
                    <span class="problem-difficulty">难度: ${solution.analysis.difficulty}</span>
                    <span class="time-constraint">时间: ${solution.analysis.timeConstraint}</span>
                </div>
            </div>

            <div class="solution-analysis">
                <h5>问题分析</h5>
                <div class="analysis-content">
                    <p><strong>关键词:</strong> ${solution.analysis.keywords.join(', ')}</p>
                    <p><strong>输入格式:</strong> ${solution.analysis.expectedInput}</p>
                    <p><strong>输出格式:</strong> ${solution.analysis.expectedOutput}</p>
                    ${solution.analysis.constraints.length > 0 ?
                      `<p><strong>约束条件:</strong> ${solution.analysis.constraints.join('; ')}</p>` : ''}
                </div>
            </div>

            <div class="solution-steps">
                <h5>解题步骤</h5>
                <ol>
                    ${solution.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>

            <div class="algorithm-details">
                <h5>算法详情</h5>
                <div class="algorithm-info">
                    <p><strong>推荐算法:</strong> ${solution.algorithm}</p>
                    <p><strong>时间复杂度:</strong> ${solution.complexity}</p>
                    <p><strong>空间复杂度:</strong> ${solution.analysis.spaceConstraint}</p>
                </div>
            </div>
        `;

        // 添加代码模板
        solutionHTML += `
            <div class="code-template">
                <h5>代码模板</h5>
                <pre><code class="language-cpp">${solution.codeTemplate}</code></pre>
            </div>
        `;

        // 添加测试用例
        if (solution.testCases.length > 0) {
            solutionHTML += `
                <div class="test-cases">
                    <h5>测试用例</h5>
                    ${solution.testCases.map((testCase, index) => `
                        <div class="test-case">
                            <h6>用例 ${index + 1}</h6>
                            <p><strong>输入:</strong> ${testCase.input}</p>
                            <p><strong>输出:</strong> ${testCase.output}</p>
                            <p><strong>说明:</strong> ${testCase.explanation}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        this.utils.setSafeHTML(solutionElement, solutionHTML);

        // 高亮代码
        this.highlightCode();
    }

    highlightCode() {
        // 简单的代码高亮
        const codeElements = document.querySelectorAll('.language-cpp');
        codeElements.forEach(element => {
            const code = element.textContent;
            // 简单的关键字高亮
            const highlighted = code
                .replace(/\b(int|void|vector|return|if|else|for|while)\b/g, '<span class="code-keyword">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
                .replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>');

            element.innerHTML = highlighted;
        });
    }

    showLoadingState() {
        const solutionElement = document.getElementById('solution-steps');
        if (solutionElement) {
            solutionElement.innerHTML = `
                <div class="ai-loading">
                    <div class="loading-spinner">
                        <i class="fas fa-brain fa-spin"></i>
                    </div>
                    <h4>ACES 系统正在分析问题...</h4>
                    <p>正在使用人工智能技术生成解决方案</p>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            `;

            // 模拟进度条
            this.simulateProgress();
        }
    }

    simulateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        if (!progressFill) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressFill.style.width = `${progress}%`;
        }, 200);
    }

    disableSolveButton() {
        const solveButton = document.getElementById('solve-problem');
        if (solveButton) {
            solveButton.disabled = true;
            solveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 解题中...';
        }
    }

    enableSolveButton() {
        const solveButton = document.getElementById('solve-problem');
        if (solveButton) {
            solveButton.disabled = false;
            solveButton.innerHTML = '<i class="fas fa-robot"></i> 使用ACES解题';
        }
    }

    analyzeProblemType() {
        const problemInput = document.getElementById('problem-input');
        const typeIndicator = document.getElementById('problem-type-indicator');

        if (!problemInput || !typeIndicator) return;

        const problem = problemInput.value.trim();
        if (!problem) {
            typeIndicator.textContent = '等待输入...';
            return;
        }

        const keywords = this.extractKeywords(problem);
        const problemType = this.classifyProblemType(keywords);

        const typeNames = {
            'sorting': '排序问题',
            'searching': '搜索问题',
            'graph': '图论问题',
            'tree': '树结构问题',
            'dynamic-programming': '动态规划问题',
            'greedy': '贪心算法问题',
            'backtracking': '回溯算法问题',
            'divide-conquer': '分治算法问题',
            'general': '通用算法问题'
        };

        typeIndicator.textContent = `检测到: ${typeNames[problemType] || '算法问题'}`;
    }

    addToHistory(problem, solution) {
        const historyItem = {
            id: this.utils.generateId(),
            problem: problem,
            solution: solution,
            timestamp: new Date().toISOString(),
            type: solution.analysis.type,
            difficulty: solution.analysis.difficulty
        };

        this.solutionHistory.unshift(historyItem);

        // 保持历史记录在最近50条
        if (this.solutionHistory.length > 50) {
            this.solutionHistory.pop();
        }

        this.saveSolutionHistory();
        this.updateHistoryDisplay();
    }

    saveSolutionHistory() {
        localStorage.setItem('aces_solution_history', JSON.stringify(this.solutionHistory));
    }

    loadSolutionHistory() {
        const savedHistory = localStorage.getItem('aces_solution_history');
        if (savedHistory) {
            this.solutionHistory = JSON.parse(savedHistory);
            this.updateHistoryDisplay();
        }
    }

    updateHistoryDisplay() {
        const historyElement = document.getElementById('solution-history');
        if (!historyElement) return;

        if (this.solutionHistory.length === 0) {
            historyElement.innerHTML = '<p>暂无解题历史</p>';
            return;
        }

        const historyHTML = this.solutionHistory.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-problem">${this.utils.sanitizeHTML(item.problem.substring(0, 100))}...</div>
                <div class="history-meta">
                    <span class="history-type">${item.type}</span>
                    <span class="history-difficulty">${item.difficulty}</span>
                    <span class="history-time">${new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <button class="history-load-btn" onclick="ACES_APP.modules.get('ai-solver').loadHistorySolution('${item.id}')">
                    查看方案
                </button>
            </div>
        `).join('');

        historyElement.innerHTML = historyHTML;
    }

    loadHistorySolution(solutionId) {
        const solution = this.solutionHistory.find(item => item.id === solutionId);
        if (solution) {
            this.displaySolution(solution.solution);
            this.showAIMessage('已加载历史解决方案', 'info');
        }
    }

    clearProblem() {
        const problemInput = document.getElementById('problem-input');
        const solutionElement = document.getElementById('solution-steps');

        if (problemInput) problemInput.value = '';
        if (solutionElement) solutionElement.innerHTML = '<p>请输入问题描述并点击"使用ACES解题"</p>';

        this.currentProblem = null;
    }

    saveSolution() {
        if (!this.currentProblem) {
            this.showAIMessage('没有可保存的解决方案', 'warning');
            return;
        }

        // 在实际应用中，这里可以保存到服务器或本地文件
        this.showAIMessage('解决方案已保存', 'success');
    }

    loadExampleProblem() {
        const examples = [
            "给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。",
            "反转一个单链表。示例: 输入: 1->2->3->4->5->NULL, 输出: 5->4->3->2->1->NULL",
            "实现一个函数，输入n，求斐波那契数列的第n项。斐波那契数列的定义如下：F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) (n>=2)"
        ];

        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        const problemInput = document.getElementById('problem-input');

        if (problemInput) {
            problemInput.value = randomExample;
            this.analyzeProblemType();
        }
    }

    showAIMessage(message, type = 'info') {
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ai-message-${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="ai-message-close">&times;</button>
        `;

        // 添加到消息容器
        const messageContainer = document.getElementById('ai-message-container') ||
                                this.createMessageContainer();

        messageContainer.appendChild(messageElement);

        // 自动消失
        setTimeout(() => {
            messageElement.remove();
        }, 5000);

        // 点击关闭
        messageElement.querySelector('.ai-message-close').addEventListener('click', () => {
            messageElement.remove();
        });
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'ai-message-container';
        container.className = 'ai-message-container';

        const aiSolverContent = document.getElementById('ai-solver-content');
        if (aiSolverContent) {
            aiSolverContent.appendChild(container);
        }

        return container;
    }

    getMessageIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    // 获取当前解决方案
    getCurrentSolution() {
        return this.solutionHistory[0]; // 返回最新的解决方案
    }

    // 清理资源
    cleanup() {
        this.solutionHistory = [];
        this.currentProblem = null;
        this.isSolving = false;
        this.isInitialized = false;

        console.log('AI解题模块清理完成');
    }
}