import { Utils } from './utils.js';

export class ProblemsManager {
    constructor() {
        this.utils = new Utils();
        this.isInitialized = false;
        this.currentProblemIndex = 0;
        this.userSolutions = new Map();
        this.problemHistory = [];
        this.problems = [];
        this.timer = null;
        this.startTime = null;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 加载题目数据
            await this.loadProblems();

            // 设置事件监听器
            this.setupEventListeners();

            // 加载用户进度
            this.loadProgress();

            // 显示第一个题目
            this.showProblem(this.currentProblemIndex);

            this.isInitialized = true;
            console.log('题目练习模块初始化完成');

        } catch (error) {
            console.error('题目练习模块初始化失败:', error);
            throw error;
        }
    }

    async loadProblems() {
        // 完整的题目数据集
        this.problems = [
            {
                id: 1,
                title: "两数之和",
                description: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。`,
                difficulty: "easy",
                tags: ["数组", "哈希表"],
                examples: [
                    {
                        input: "nums = [2,7,11,15], target = 9",
                        output: "[0,1]",
                        explanation: "因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。"
                    },
                    {
                        input: "nums = [3,2,4], target = 6",
                        output: "[1,2]",
                        explanation: "因为 nums[1] + nums[2] == 6 ，返回 [1, 2] 。"
                    },
                    {
                        input: "nums = [3,3], target = 6",
                        output: "[0,1]",
                        explanation: "因为 nums[0] + nums[1] == 6 ，返回 [0, 1] 。"
                    }
                ],
                constraints: [
                    "2 <= nums.length <= 10^4",
                    "-10^9 <= nums[i] <= 10^9",
                    "-10^9 <= target <= 10^9",
                    "只会存在一个有效答案"
                ],
                template: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // 在这里编写你的代码

    }
};`,
                hints: [
                    "使用哈希表来存储已经遍历过的数字及其索引",
                    "对于每个数字，计算其与目标的差值，然后在哈希表中查找这个差值",
                    "时间复杂度为O(n)，空间复杂度为O(n)"
                ],
                solution: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`
            },
            {
                id: 2,
                title: "反转链表",
                description: `给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。`,
                difficulty: "easy",
                tags: ["链表", "递归"],
                examples: [
                    {
                        input: "head = [1,2,3,4,5]",
                        output: "[5,4,3,2,1]",
                        explanation: ""
                    },
                    {
                        input: "head = [1,2]",
                        output: "[2,1]",
                        explanation: ""
                    },
                    {
                        input: "head = []",
                        output: "[]",
                        explanation: ""
                    }
                ],
                constraints: [
                    "链表中节点的数目范围是 [0, 5000]",
                    "-5000 <= Node.val <= 5000"
                ],
                template: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // 在这里编写你的代码

    }
};`,
                hints: [
                    "可以使用迭代或递归的方法",
                    "迭代方法需要三个指针：prev, current, next",
                    "递归方法需要理解递归的终止条件和反转逻辑"
                ],
                solution: `// 迭代解法
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};

// 递归解法
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* newHead = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
        return newHead;
    }
};`
            },
            {
                id: 3,
                title: "斐波那契数列",
                description: `写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：

F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.

斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。`,
                difficulty: "easy",
                tags: ["递归", "动态规划", "记忆化搜索"],
                examples: [
                    {
                        input: "n = 2",
                        output: "1",
                        explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1"
                    },
                    {
                        input: "n = 5",
                        output: "5",
                        explanation: "F(5) = F(4) + F(3) = 3 + 2 = 5"
                    }
                ],
                constraints: [
                    "0 <= n <= 100"
                ],
                template: `class Solution {
public:
    int fib(int n) {
        // 在这里编写你的代码

    }
};`,
                hints: [
                    "使用动态规划来避免重复计算",
                    "只需要存储前两个状态，不需要存储整个数组",
                    "注意取模运算和边界条件"
                ],
                solution: `class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        int mod = 1e9 + 7;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int c = (a + b) % mod;
            a = b;
            b = c;
        }
        return b;
    }
};`
            },
            {
                id: 4,
                title: "爬楼梯",
                description: `假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？`,
                difficulty: "easy",
                tags: ["动态规划", "数学"],
                examples: [
                    {
                        input: "n = 2",
                        output: "2",
                        explanation: "有两种方法可以爬到楼顶：1. 1 阶 + 1 阶 2. 2 阶"
                    },
                    {
                        input: "n = 3",
                        output: "3",
                        explanation: "有三种方法可以爬到楼顶：1. 1 阶 + 1 阶 + 1 阶 2. 1 阶 + 2 阶 3. 2 阶 + 1 阶"
                    }
                ],
                constraints: [
                    "1 <= n <= 45"
                ],
                template: `class Solution {
public:
    int climbStairs(int n) {
        // 在这里编写你的代码

    }
};`,
                hints: [
                    "这个问题实际上是斐波那契数列的变种",
                    "到达第n阶的方法数 = 到达第n-1阶的方法数 + 到达第n-2阶的方法数",
                    "使用动态规划来避免重复计算"
                ],
                solution: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};`
            }
        ];
    }

    setupEventListeners() {
        document.addEventListener('click', (event) => {
            switch (event.target.id) {
                case 'submit-solution':
                    this.submitSolution();
                    break;
                case 'run-test':
                    this.runTest();
                    break;
                case 'next-problem':
                    this.nextProblem();
                    break;
                case 'prev-problem':
                    this.prevProblem();
                    break;
                case 'show-hint':
                    this.showHint();
                    break;
                case 'show-solution':
                    this.showSolution();
                    break;
                case 'reset-code':
                    this.resetCode();
                    break;
                case 'start-timer':
                    this.startTimer();
                    break;
                case 'stop-timer':
                    this.stopTimer();
                    break;
            }
        });

        // 题目选择
        document.addEventListener('change', (event) => {
            if (event.target.id === 'problem-select') {
                const index = parseInt(event.target.value);
                this.showProblem(index);
            }
        });

        // 难度筛选
        document.addEventListener('change', (event) => {
            if (event.target.id === 'difficulty-filter') {
                this.filterProblems();
            }
        });

        // 标签筛选
        document.addEventListener('change', (event) => {
            if (event.target.id === 'tag-filter') {
                this.filterProblems();
            }
        });
    }

    showProblem(index) {
        if (index < 0 || index >= this.problems.length) return;

        this.currentProblemIndex = index;
        const problem = this.problems[index];

        // 停止之前的计时器
        this.stopTimer();

        // 更新题目显示
        this.updateProblemDisplay(problem);

        // 加载用户之前的解答
        this.loadUserSolution(problem.id);

        // 更新导航状态
        this.updateNavigation();

        // 添加到历史记录
        this.addToHistory(problem);

        // 更新进度显示
        this.updateProgress();
    }

    updateProblemDisplay(problem) {
        // 更新题目信息
        document.getElementById('problem-title').textContent = `${problem.id}. ${problem.title}`;
        document.getElementById('problem-description').textContent = problem.description;

        // 更新难度标签
        const difficultyElement = document.getElementById('problem-difficulty');
        difficultyElement.textContent = this.getDifficultyText(problem.difficulty);
        difficultyElement.className = `difficulty-badge difficulty-${problem.difficulty}`;

        // 更新标签
        const tagsElement = document.getElementById('problem-tags');
        tagsElement.innerHTML = problem.tags.map(tag =>
            `<span class="problem-tag">${tag}</span>`
        ).join('');

        // 更新示例
        const examplesContainer = document.getElementById('problem-examples');
        examplesContainer.innerHTML = problem.examples.map((example, index) => `
            <div class="example">
                <h5>示例 ${index + 1}:</h5>
                <p><strong>输入:</strong> ${example.input}</p>
                <p><strong>输出:</strong> ${example.output}</p>
                ${example.explanation ? `<p><strong>解释:</strong> ${example.explanation}</p>` : ''}
            </div>
        `).join('');

        // 更新约束条件
        const constraintsContainer = document.getElementById('problem-constraints');
        constraintsContainer.innerHTML = '<h5>约束条件:</h5>' +
            problem.constraints.map(constraint => `<li>${constraint}</li>`).join('');

        // 更新代码模板
        const solutionCode = document.getElementById('solution-code');
        solutionCode.value = problem.template;

        // 更新题目选择器
        const problemSelect = document.getElementById('problem-select');
        if (problemSelect) {
            problemSelect.innerHTML = this.problems.map((p, i) =>
                `<option value="${i}">${p.id}. ${p.title}</option>`
            ).join('');
            problemSelect.value = index;
        }

        // 重置测试结果
        this.clearTestResult();
    }

    getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': '简单',
            'medium': '中等',
            'hard': '困难'
        };
        return difficultyMap[difficulty] || difficulty;
    }

    loadUserSolution(problemId) {
        const savedSolution = this.userSolutions.get(problemId);
        const solutionCode = document.getElementById('solution-code');

        if (savedSolution && solutionCode) {
            solutionCode.value = savedSolution;
        }
    }

    saveUserSolution(problemId, code) {
        this.userSolutions.set(problemId, code);
        this.saveProgress();
    }

    submitSolution() {
        const problem = this.problems[this.currentProblemIndex];
        const code = document.getElementById('solution-code').value;

        if (!code.trim()) {
            this.showResult('请先编写代码', 'warning');
            return;
        }

        // 保存解答
        this.saveUserSolution(problem.id, code);

        // 模拟提交和评测
        this.showResult('正在提交并评测...', 'info');
        this.startTimer();

        setTimeout(() => {
            // 模拟评测结果
            const passed = Math.random() > 0.3; // 70% 通过率
            if (passed) {
                this.showResult(`
                    ✅ 通过所有测试用例！

                    执行用时: 4 ms
                    内存消耗: 6.8 MB
                    击败了 90% 的用户

                    提交成功！
                `, 'success');

                // 更新问题状态为已解决
                this.markProblemSolved(problem.id);
            } else {
                this.showResult(`
                    ❌ 未通过所有测试用例

                    输入: [2,7,11,15], 9
                    预期输出: [0,1]
                    你的输出: [1,2]

                    请检查代码逻辑
                `, 'error');
            }

            this.stopTimer();
        }, 2000);
    }

    runTest() {
        const problem = this.problems[this.currentProblemIndex];
        const code = document.getElementById('solution-code').value;

        if (!code.trim()) {
            this.showResult('请先编写代码', 'warning');
            return;
        }

        // 保存解答
        this.saveUserSolution(problem.id, code);

        // 模拟测试运行
        this.showResult('正在运行测试用例...', 'info');
        this.startTimer();

        setTimeout(() => {
            // 模拟测试结果
            const passed = Math.random() > 0.2; // 80% 通过率
            if (passed) {
                this.showResult(`
                    ✅ 通过示例测试用例！

                    测试用例 1/3: 通过
                    测试用例 2/3: 通过
                    测试用例 3/3: 通过

                    准备提交完整评测...
                `, 'success');
            } else {
                this.showResult(`
                    ❌ 示例测试用例失败

                    测试用例 1/3: 通过
                    测试用例 2/3: 失败
                    测试用例 3/3: 通过

                    请检查代码逻辑
                    提示: 考虑边界情况
                `, 'error');
            }

            this.stopTimer();
        }, 1500);
    }

    showResult(message, type) {
        const resultElement = document.getElementById('test-result');
        if (!resultElement) return;

        resultElement.innerHTML = `
            <div class="test-result test-result-${type}">
                <pre>${message}</pre>
            </div>
        `;

        // 自动滚动到结果
        resultElement.scrollIntoView({ behavior: 'smooth' });
    }

    clearTestResult() {
        const resultElement = document.getElementById('test-result');
        if (resultElement) {
            resultElement.innerHTML = '';
        }
    }

    nextProblem() {
        if (this.currentProblemIndex < this.problems.length - 1) {
            this.showProblem(this.currentProblemIndex + 1);
        } else {
            this.showResult('已经是最后一题了！', 'info');
        }
    }

    prevProblem() {
        if (this.currentProblemIndex > 0) {
            this.showProblem(this.currentProblemIndex - 1);
        } else {
            this.showResult('已经是第一题了！', 'info');
        }
    }

    updateNavigation() {
        const prevButton = document.getElementById('prev-problem');
        const nextButton = document.getElementById('next-problem');
        const problemSelect = document.getElementById('problem-select');

        if (prevButton) {
            prevButton.disabled = this.currentProblemIndex === 0;
        }
        if (nextButton) {
            nextButton.disabled = this.currentProblemIndex === this.problems.length - 1;
        }
        if (problemSelect) {
            problemSelect.value = this.currentProblemIndex;
        }
    }

    showHint() {
        const problem = this.problems[this.currentProblemIndex];
        const hintIndex = Math.floor(Math.random() * problem.hints.length);
        const hint = problem.hints[hintIndex];

        this.showResult(`💡 提示: ${hint}`, 'info');
    }

    showSolution() {
        const problem = this.problems[this.currentProblemIndex];

        if (confirm('确定要查看答案吗？这将影响你的学习进度。')) {
            const solutionCode = document.getElementById('solution-code');
            solutionCode.value = problem.solution;
            this.saveUserSolution(problem.id, problem.solution);
            this.showResult('已显示参考答案，请理解后自己重新实现。', 'warning');
        }
    }

    resetCode() {
        const problem = this.problems[this.currentProblemIndex];
        const solutionCode = document.getElementById('solution-code');
        solutionCode.value = problem.template;
        this.showResult('代码已重置为初始模板', 'info');
    }

    startTimer() {
        this.stopTimer();
        this.startTime = Date.now();

        this.timer = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);

            const timerElement = document.getElementById('problem-timer');
            if (timerElement) {
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    addToHistory(problem) {
        const historyItem = {
            problemId: problem.id,
            problemTitle: problem.title,
            timestamp: new Date().toISOString(),
            timeSpent: 0
        };

        this.problemHistory.unshift(historyItem);

        // 保持历史记录在最近50条
        if (this.problemHistory.length > 50) {
            this.problemHistory.pop();
        }

        this.saveProgress();
    }

    markProblemSolved(problemId) {
        let solvedProblems = JSON.parse(localStorage.getItem('aces_solved_problems') || '[]');
        if (!solvedProblems.includes(problemId)) {
            solvedProblems.push(problemId);
            localStorage.setItem('aces_solved_problems', JSON.stringify(solvedProblems));
        }
    }

    isProblemSolved(problemId) {
        const solvedProblems = JSON.parse(localStorage.getItem('aces_solved_problems') || '[]');
        return solvedProblems.includes(problemId);
    }

    filterProblems() {
        const difficultyFilter = document.getElementById('difficulty-filter')?.value;
        const tagFilter = document.getElementById('tag-filter')?.value;

        let filteredProblems = this.problems;

        if (difficultyFilter && difficultyFilter !== 'all') {
            filteredProblems = filteredProblems.filter(p => p.difficulty === difficultyFilter);
        }

        if (tagFilter && tagFilter !== 'all') {
            filteredProblems = filteredProblems.filter(p => p.tags.includes(tagFilter));
        }

        this.updateProblemList(filteredProblems);
    }

    updateProblemList(problems) {
        const problemList = document.getElementById('problem-list');
        if (!problemList) return;

        const problemHTML = problems.map(problem => {
            const isSolved = this.isProblemSolved(problem.id);
            const isCurrent = problem.id === this.problems[this.currentProblemIndex].id;

            return `
                <div class="problem-list-item ${isCurrent ? 'active' : ''} ${isSolved ? 'solved' : ''}"
                     onclick="ACES_APP.modules.get('problems').showProblemByIndex(${this.problems.findIndex(p => p.id === problem.id)})">
                    <div class="problem-item-header">
                        <span class="problem-item-id">${problem.id}</span>
                        <span class="problem-item-title">${problem.title}</span>
                        ${isSolved ? '<i class="fas fa-check solved-icon"></i>' : ''}
                    </div>
                    <div class="problem-item-meta">
                        <span class="difficulty-badge difficulty-${problem.difficulty}">
                            ${this.getDifficultyText(problem.difficulty)}
                        </span>
                        <div class="problem-item-tags">
                            ${problem.tags.map(tag => `<span class="problem-tag-small">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        problemList.innerHTML = problemHTML;
    }

    showProblemByIndex(index) {
        this.showProblem(index);
    }

    updateProgress() {
        const totalProblems = this.problems.length;
        const solvedProblems = JSON.parse(localStorage.getItem('aces_solved_problems') || '[]').length;
        const progress = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

        const progressElement = document.getElementById('problems-progress');
        if (progressElement) {
            progressElement.innerHTML = `
                <div class="progress-header">
                    <h4>刷题进度</h4>
                    <span>${solvedProblems}/${totalProblems}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-text">已完成 ${progress}%</div>
            `;
        }
    }

    saveProgress() {
        const progress = {
            currentProblemIndex: this.currentProblemIndex,
            userSolutions: Array.from(this.userSolutions.entries()),
            problemHistory: this.problemHistory
        };

        try {
            localStorage.setItem('aces_problems_progress', JSON.stringify(progress));
        } catch (error) {
            console.error('保存进度失败:', error);
        }
    }

    loadProgress() {
        try {
            const savedProgress = localStorage.getItem('aces_problems_progress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                this.currentProblemIndex = progress.currentProblemIndex || 0;
                this.userSolutions = new Map(progress.userSolutions || []);
                this.problemHistory = progress.problemHistory || [];
            }
        } catch (error) {
            console.error('加载进度失败:', error);
        }
    }

    // 获取当前题目
    getCurrentProblem() {
        return this.problems[this.currentProblemIndex];
    }

    // 获取用户解答
    getUserSolution(problemId) {
        return this.userSolutions.get(problemId);
    }

    // 获取学习统计
    getLearningStats() {
        const totalProblems = this.problems.length;
        const solvedProblems = JSON.parse(localStorage.getItem('aces_solved_problems') || '[]').length;
        const totalTime = this.problemHistory.reduce((sum, item) => sum + item.timeSpent, 0);

        // 计算按难度的完成情况
        const difficultyStats = {};
        this.problems.forEach(problem => {
            if (!difficultyStats[problem.difficulty]) {
                difficultyStats[problem.difficulty] = { total: 0, solved: 0 };
            }
            difficultyStats[problem.difficulty].total++;
            if (this.isProblemSolved(problem.id)) {
                difficultyStats[problem.difficulty].solved++;
            }
        });

        return {
            totalProblems,
            solvedProblems,
            progress: totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0,
            totalTime,
            difficultyStats
        };
    }

    // 导出学习数据
    exportProgress() {
        const exportData = {
            userSolutions: Array.from(this.userSolutions.entries()),
            problemHistory: this.problemHistory,
            solvedProblems: JSON.parse(localStorage.getItem('aces_solved_problems') || '[]'),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `aces-problems-progress-${new Date().getTime()}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }

    // 清理资源
    cleanup() {
        this.stopTimer();
        this.saveProgress();

        this.problems = [];
        this.userSolutions.clear();
        this.problemHistory = [];
        this.isInitialized = false;

        console.log('题目练习模块清理完成');
    }
}