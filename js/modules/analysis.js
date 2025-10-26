import { Utils } from './utils.js';

export class AnalysisManager {
    constructor() {
        this.utils = new Utils();
        this.isInitialized = false;
        this.learningData = {};
        this.charts = new Map();
        this.updateInterval = null;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 动态加载Chart.js
            await this.loadChartJS();

            // 加载学习数据
            this.loadLearningData();

            // 初始化图表
            this.initializeCharts();

            // 设置事件监听器
            this.setupEventListeners();

            // 启动数据更新
            this.startDataUpdate();

            this.isInitialized = true;
            console.log('学习分析模块初始化完成');

        } catch (error) {
            console.error('学习分析模块初始化失败:', error);
            throw error;
        }
    }

    async loadChartJS() {
        if (window.Chart) return;

        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js');
    }

    loadLearningData() {
        // 从各个模块加载学习数据
        const savedData = localStorage.getItem('aces_learning_data');
        if (savedData) {
            this.learningData = JSON.parse(savedData);
        } else {
            this.initializeDefaultData();
        }

        // 从其他模块获取最新数据
        this.syncWithOtherModules();
    }

    initializeDefaultData() {
        this.learningData = {
            userInfo: {
                username: '学习者',
                joinDate: new Date().toISOString(),
                level: 1,
                experience: 0
            },
            progressHistory: [
                { date: '2023-01-01', progress: 10, topics: ['C++基础'] },
                { date: '2023-01-08', progress: 15, topics: ['C++基础', '数据结构'] },
                { date: '2023-01-15', progress: 20, topics: ['数据结构'] },
                { date: '2023-01-22', progress: 25, topics: ['数据结构', '算法'] },
                { date: '2023-01-29', progress: 30, topics: ['算法'] },
                { date: '2023-02-05', progress: 40, topics: ['算法', '动态规划'] },
                { date: '2023-02-12', progress: 50, topics: ['动态规划'] },
                { date: '2023-02-19', progress: 60, topics: ['动态规划', '图论'] },
                { date: '2023-02-26', progress: 70, topics: ['图论'] },
                { date: '2023-03-05', progress: 75, topics: ['图论', '题目练习'] },
                { date: '2023-03-12', progress: 80, topics: ['题目练习'] },
                { date: '2023-03-19', progress: 85, topics: ['题目练习', '项目实践'] }
            ],
            algorithmMastery: {
                'DFS': { level: 70, practiceCount: 15, lastPractice: '2023-03-15' },
                'BFS': { level: 60, practiceCount: 12, lastPractice: '2023-03-14' },
                'DP': { level: 40, practiceCount: 8, lastPractice: '2023-03-10' },
                'Dijkstra': { level: 50, practiceCount: 6, lastPractice: '2023-03-12' },
                'QuickSort': { level: 80, practiceCount: 20, lastPractice: '2023-03-18' },
                'MergeSort': { level: 65, practiceCount: 15, lastPractice: '2023-03-16' },
                'HeapSort': { level: 55, practiceCount: 10, lastPractice: '2023-03-13' },
                'Kruskal': { level: 45, practiceCount: 5, lastPractice: '2023-03-11' },
                'Knapsack': { level: 60, practiceCount: 9, lastPractice: '2023-03-17' }
            },
            skillAssessment: {
                '算法理解': 65,
                '代码实现': 70,
                '问题分析': 60,
                '调试能力': 75,
                '复杂度分析': 55,
                '数据结构': 80,
                '系统设计': 45
            },
            studyTime: {
                'C++基础': 15,
                '数据结构': 25,
                '算法设计': 30,
                '题目练习': 20,
                '项目实践': 10,
                '复习总结': 5
            },
            weeklyGoals: [
                { goal: '完成动态规划章节', completed: true, priority: 'high' },
                { goal: '练习10道算法题', completed: true, priority: 'high' },
                { goal: '学习图论算法', completed: false, priority: 'medium' },
                { goal: '复习排序算法', completed: true, priority: 'low' },
                { goal: '完成项目实践', completed: false, priority: 'medium' }
            ],
            activityLog: [
                { date: '2023-03-20', activity: '完成了"两数之和"题目', type: 'problem', duration: 30 },
                { date: '2023-03-20', activity: '学习了动态规划基础', type: 'study', duration: 45 },
                { date: '2023-03-19', activity: '复习了C++模板', type: 'review', duration: 20 },
                { date: '2023-03-18', activity: '完成了5道算法题', type: 'problem', duration: 60 },
                { date: '2023-03-17', activity: '学习了图论算法', type: 'study', duration: 50 }
            ]
        };
    }

    syncWithOtherModules() {
        // 从题目练习模块获取数据
        try {
            const problemsModule = window.ACES_APP?.modules?.get('problems');
            if (problemsModule) {
                const stats = problemsModule.getLearningStats();
                this.learningData.problemStats = stats;
            }
        } catch (error) {
            console.warn('无法从题目模块获取数据:', error);
        }

        // 从Markdown模块获取数据
        try {
            const markdownModule = window.ACES_APP?.modules?.get('markdown');
            if (markdownModule) {
                const stats = markdownModule.getNotesStats();
                this.learningData.noteStats = stats;
            }
        } catch (error) {
            console.warn('无法从Markdown模块获取数据:', error);
        }
    }

    initializeCharts() {
        this.createProgressChart();
        this.createSkillRadarChart();
        this.createAlgorithmChart();
        this.createStudyTimeChart();
        this.createActivityChart();
        this.createGoalChart();
    }

    createProgressChart() {
        const ctx = document.getElementById('progress-chart');
        if (!ctx) return;

        const data = this.learningData.progressHistory;
        const dates = data.map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const progress = data.map(item => item.progress);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: '学习进度 (%)',
                    data: progress,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '学习进度趋势',
                        font: { size: 16 }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            afterLabel: (context) => {
                                const index = context.dataIndex;
                                const topics = data[index].topics;
                                return `学习内容: ${topics.join(', ')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '日期'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '进度 (%)'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });

        this.charts.set('progress', chart);
    }

    createSkillRadarChart() {
        const ctx = document.getElementById('radar-chart');
        if (!ctx) return;

        const skills = this.learningData.skillAssessment;
        const labels = Object.keys(skills);
        const data = Object.values(skills);

        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: '当前能力',
                    data: data,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 152, 219, 1)',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '技能评估雷达图',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}/100`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('radar', chart);
    }

    createAlgorithmChart() {
        const ctx = document.getElementById('algorithm-chart');
        if (!ctx) return;

        const algorithms = this.learningData.algorithmMastery;
        const labels = Object.keys(algorithms);
        const data = Object.values(algorithms).map(item => item.level);
        const practiceCounts = Object.values(algorithms).map(item => item.practiceCount);

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '掌握程度 (%)',
                        data: data,
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: '练习次数',
                        data: practiceCounts,
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '算法掌握程度与练习次数',
                        font: { size: 16 }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '算法'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: '掌握程度 (%)'
                        },
                        min: 0,
                        max: 100
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '练习次数'
                        },
                        min: 0,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });

        this.charts.set('algorithm', chart);
    }

    createStudyTimeChart() {
        const ctx = document.getElementById('study-time-chart');
        if (!ctx) return;

        const studyTime = this.learningData.studyTime;
        const labels = Object.keys(studyTime);
        const data = Object.values(studyTime);

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(231, 76, 60, 0.7)',
                        'rgba(243, 156, 18, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(241, 196, 15, 0.7)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(231, 76, 60, 1)',
                        'rgba(243, 156, 18, 1)',
                        'rgba(155, 89, 182, 1)',
                        'rgba(241, 196, 15, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '学习时间分布',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value}小时 (${percentage}%)`;
                            }
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        this.charts.set('studyTime', chart);
    }

    createActivityChart() {
        const ctx = document.getElementById('activity-chart');
        if (!ctx) return;

        // 按类型统计活动
        const activityTypes = {};
        this.learningData.activityLog.forEach(activity => {
            if (!activityTypes[activity.type]) {
                activityTypes[activity.type] = 0;
            }
            activityTypes[activity.type] += activity.duration;
        });

        const chart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: Object.keys(activityTypes).map(type => {
                    const typeNames = {
                        'study': '学习',
                        'problem': '刷题',
                        'review': '复习',
                        'project': '项目'
                    };
                    return typeNames[type] || type;
                }),
                datasets: [{
                    data: Object.values(activityTypes),
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(243, 156, 18, 0.7)',
                        'rgba(155, 89, 182, 0.7)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(243, 156, 18, 1)',
                        'rgba(155, 89, 182, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '学习活动分布',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}分钟`;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('activity', chart);
    }

    createGoalChart() {
        const ctx = document.getElementById('goal-chart');
        if (!ctx) return;

        const goals = this.learningData.weeklyGoals;
        const completed = goals.filter(g => g.completed).length;
        const total = goals.length;

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['已完成', '未完成'],
                datasets: [{
                    data: [completed, total - completed],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(231, 76, 60, 0.7)'
                    ],
                    borderColor: [
                        'rgba(46, 204, 113, 1)',
                        'rgba(231, 76, 60, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '本周目标完成情况',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value}个 (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('goal', chart);
    }

    setupEventListeners() {
        document.addEventListener('click', (event) => {
            switch (event.target.id) {
                case 'generate-report':
                    this.generateReport();
                    break;
                case 'export-data':
                    this.exportData();
                    break;
                case 'import-data':
                    document.getElementById('import-data-file').click();
                    break;
                case 'update-progress':
                    this.updateProgress();
                    break;
                case 'refresh-charts':
                    this.refreshCharts();
                    break;
                case 'add-goal':
                    this.addGoal();
                    break;
            }
        });

        // 时间范围选择
        document.addEventListener('change', (event) => {
            if (event.target.id === 'time-range') {
                this.updateTimeRange(event.target.value);
            }
        });

        // 导入数据
        document.addEventListener('change', (event) => {
            if (event.target.id === 'import-data-file') {
                this.importData(event.target.files[0]);
            }
        });
    }

    startDataUpdate() {
        // 每30秒同步一次数据
        this.updateInterval = setInterval(() => {
            this.syncWithOtherModules();
            this.updateCharts();
        }, 30000);
    }

    updateTimeRange(range) {
        // 根据选择的时间范围过滤数据
        const now = new Date();
        let filteredData = [...this.learningData.progressHistory];

        switch (range) {
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredData = filteredData.filter(item => new Date(item.date) >= weekAgo);
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredData = filteredData.filter(item => new Date(item.date) >= monthAgo);
                break;
            case 'year':
                // 默认显示所有数据
                break;
        }

        this.updateProgressChart(filteredData);
    }

    updateProgressChart(data) {
        const progressChart = this.charts.get('progress');
        if (!progressChart) return;

        const dates = data.map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const progress = data.map(item => item.progress);

        progressChart.data.labels = dates;
        progressChart.data.datasets[0].data = progress;
        progressChart.update();
    }

    generateReport() {
        const reportElement = document.getElementById('learning-report');
        if (!reportElement) return;

        const overallProgress = this.calculateOverallProgress();
        const weakAreas = this.identifyWeakAreas();
        const recommendations = this.generateRecommendations();
        const stats = this.calculateStats();

        const report = `
ACES 学习分析报告
====================

生成时间: ${new Date().toLocaleString()}

📊 总体概况
-----------
总体学习进度: ${overallProgress}%
学习时长: ${stats.totalStudyTime} 小时
完成题目: ${stats.solvedProblems} 道
笔记数量: ${stats.noteCount} 篇

🎯 目标完成情况
---------------
${this.learningData.weeklyGoals.map(goal =>
    `${goal.completed ? '✅' : '❌'} ${goal.goal} ${goal.priority === 'high' ? '🔴' : goal.priority === 'medium' ? '🟡' : '🟢'}`
).join('\n')}

📈 能力评估
-----------
${Object.entries(this.learningData.skillAssessment).map(([skill, level]) =>
    `${this.getSkillEmoji(level)} ${skill}: ${level}/100`
).join('\n')}

🤔 待提升领域
-------------
${weakAreas.map(area => `• ${area}`).join('\n')}

💡 学习建议
-----------
${recommendations.map(rec => `• ${rec}`).join('\n')}

📅 近期活动
-----------
${this.learningData.activityLog.slice(0, 5).map(activity =>
    `• ${activity.date}: ${activity.activity} (${activity.duration}分钟)`
).join('\n')}

继续保持，加油！ 💪
====================
        `.trim();

        reportElement.textContent = report;

        // 生成可视化报告
        this.generateVisualReport(stats);
    }

    generateVisualReport(stats) {
        const visualReport = document.getElementById('visual-report');
        if (!visualReport) return;

        const html = `
            <div class="report-cards">
                <div class="report-card">
                    <div class="report-card-icon">📚</div>
                    <div class="report-card-value">${stats.totalStudyTime}h</div>
                    <div class="report-card-label">总学习时长</div>
                </div>
                <div class="report-card">
                    <div class="report-card-icon">✅</div>
                    <div class="report-card-value">${stats.solvedProblems}</div>
                    <div class="report-card-label">完成题目</div>
                </div>
                <div class="report-card">
                    <div class="report-card-icon">📝</div>
                    <div class="report-card-value">${stats.noteCount}</div>
                    <div class="report-card-label">学习笔记</div>
                </div>
                <div class="report-card">
                    <div class="report-card-icon">⚡</div>
                    <div class="report-card-value">${this.learningData.weeklyGoals.filter(g => g.completed).length}</div>
                    <div class="report-card-label">完成目标</div>
                </div>
            </div>

            <div class="report-section">
                <h4>📊 学习分布</h4>
                <div class="study-distribution">
                    ${Object.entries(this.learningData.studyTime).map(([category, hours]) => `
                        <div class="distribution-item">
                            <span class="distribution-category">${category}</span>
                            <div class="distribution-bar">
                                <div class="distribution-fill" style="width: ${(hours / stats.totalStudyTime) * 100}%"></div>
                            </div>
                            <span class="distribution-hours">${hours}h</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="report-section">
                <h4>🎯 建议重点</h4>
                <div class="focus-areas">
                    ${this.identifyWeakAreas().slice(0, 3).map(area => `
                        <div class="focus-area">
                            <i class="fas fa-bullseye"></i>
                            <span>${area}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.utils.setSafeHTML(visualReport, html);
    }

    calculateOverallProgress() {
        const algorithmProgress = Object.values(this.learningData.algorithmMastery)
            .map(item => item.level);
        const skillProgress = Object.values(this.learningData.skillAssessment);

        const avgAlgorithm = algorithmProgress.reduce((sum, progress) => sum + progress, 0) / algorithmProgress.length;
        const avgSkill = skillProgress.reduce((sum, progress) => sum + progress, 0) / skillProgress.length;

        return Math.round((avgAlgorithm + avgSkill) / 2);
    }

    identifyWeakAreas() {
        const weakAreas = [];
        const algorithmMastery = this.learningData.algorithmMastery;
        const skillAssessment = this.learningData.skillAssessment;

        // 找出掌握程度低于60%的算法
        Object.entries(algorithmMastery).forEach(([algo, data]) => {
            if (data.level < 60) {
                weakAreas.push(`算法: ${algo} (${data.level}%) - 建议多练习`);
            }
        });

        // 找出技能评估低于60的领域
        Object.entries(skillAssessment).forEach(([skill, level]) => {
            if (level < 60) {
                weakAreas.push(`技能: ${skill} (${level}/100) - 需要加强学习`);
            }
        });

        return weakAreas.length > 0 ? weakAreas : ['暂无明显弱项，继续保持当前学习节奏！'];
    }

    generateRecommendations() {
        const recommendations = [];
        const algorithmMastery = this.learningData.algorithmMastery;
        const studyTime = this.learningData.studyTime;

        // 基于算法掌握程度的建议
        if (algorithmMastery['DP']?.level < 50) {
            recommendations.push('加强动态规划的学习，建议练习背包问题和最长公共子序列');
        }

        if (algorithmMastery['Dijkstra']?.level < 60) {
            recommendations.push('需要加强图论算法的学习，特别是最短路径算法');
        }

        // 基于学习时间的建议
        if (studyTime['算法设计'] < 20) {
            recommendations.push('增加算法设计的学习时间，建议每周至少10小时');
        }

        if (studyTime['题目练习'] < 15) {
            recommendations.push('增加题目练习时间，实践是提高编程能力的关键');
        }

        // 基于技能评估的建议
        if (this.learningData.skillAssessment['复杂度分析'] < 60) {
            recommendations.push('加强时间复杂度分析能力，多做复杂度分析练习');
        }

        if (recommendations.length === 0) {
            recommendations.push('学习计划良好，建议继续保持当前的学习节奏');
            recommendations.push('可以尝试挑战更难的题目和项目来进一步提升');
        }

        return recommendations;
    }

    calculateStats() {
        const totalStudyTime = Object.values(this.learningData.studyTime).reduce((sum, hours) => sum + hours, 0);
        const solvedProblems = this.learningData.problemStats?.solvedProblems || 0;
        const noteCount = this.learningData.noteStats?.totalNotes || 0;

        return {
            totalStudyTime,
            solvedProblems,
            noteCount,
            averageDailyTime: Math.round(totalStudyTime / 7) // 假设一周学习
        };
    }

    getSkillEmoji(level) {
        if (level >= 80) return '🌟';
        if (level >= 60) return '✅';
        if (level >= 40) return '🔶';
        return '🔴';
    }

    updateProgress() {
        // 模拟更新进度
        const newProgress = Math.min(this.calculateOverallProgress() + 5, 100);

        this.learningData.progressHistory.push({
            date: new Date().toISOString().split('T')[0],
            progress: newProgress,
            topics: ['综合学习']
        });

        // 更新一个随机算法的掌握程度
        const algorithms = Object.keys(this.learningData.algorithmMastery);
        const randomAlgo = algorithms[Math.floor(Math.random() * algorithms.length)];
        this.learningData.algorithmMastery[randomAlgo].level = Math.min(
            this.learningData.algorithmMastery[randomAlgo].level + 5, 100
        );
        this.learningData.algorithmMastery[randomAlgo].practiceCount += 1;

        // 保存数据并更新图表
        this.saveLearningData();
        this.updateCharts();

        this.showMessage('学习进度已更新', 'success');
    }

    refreshCharts() {
        this.syncWithOtherModules();
        this.updateCharts();
        this.showMessage('图表数据已刷新', 'info');
    }

    updateCharts() {
        this.charts.forEach(chart => {
            chart.update();
        });
    }

    addGoal() {
        const goalText = prompt('请输入新的学习目标:');
        if (goalText) {
            const priority = prompt('请输入优先级 (high/medium/low):', 'medium');

            this.learningData.weeklyGoals.push({
                goal: goalText,
                completed: false,
                priority: priority || 'medium'
            });

            this.saveLearningData();
            this.updateGoalChart();
            this.showMessage('目标已添加', 'success');
        }
    }

    updateGoalChart() {
        const goalChart = this.charts.get('goal');
        if (!goalChart) return;

        const goals = this.learningData.weeklyGoals;
        const completed = goals.filter(g => g.completed).length;
        const total = goals.length;

        goalChart.data.datasets[0].data = [completed, total - completed];
        goalChart.update();
    }

    exportData() {
        const exportData = {
            learningData: this.learningData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `aces-learning-data-${new Date().getTime()}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
        this.showMessage('学习数据已导出', 'success');
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (importedData.learningData) {
                    this.learningData = { ...this.learningData, ...importedData.learningData };
                    this.saveLearningData();
                    this.updateCharts();
                    this.showMessage('学习数据导入成功', 'success');
                } else {
                    throw new Error('无效的数据文件格式');
                }
            } catch (error) {
                this.showMessage(`导入失败: ${error.message}`, 'error');
            }
        };
        reader.onerror = () => {
            this.showMessage('文件读取失败', 'error');
        };
        reader.readAsText(file);
    }

    saveLearningData() {
        try {
            localStorage.setItem('aces_learning_data', JSON.stringify(this.learningData));
        } catch (error) {
            console.error('保存学习数据失败:', error);
            this.showMessage('保存失败: 存储空间不足', 'error');
        }
    }

    showMessage(message, type) {
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `analysis-message analysis-message-${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="analysis-message-close">&times;</button>
        `;

        // 添加到消息容器
        const messageContainer = document.getElementById('analysis-message-container') ||
                                this.createMessageContainer();

        messageContainer.appendChild(messageElement);

        // 自动消失
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);

        // 点击关闭
        messageElement.querySelector('.analysis-message-close').addEventListener('click', () => {
            messageElement.remove();
        });
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'analysis-message-container';
        container.className = 'analysis-message-container';

        const analysisContent = document.getElementById('analysis-content');
        if (analysisContent) {
            analysisContent.appendChild(container);
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

    // 获取学习数据
    getLearningData() {
        return this.learningData;
    }

    // 更新特定算法的掌握程度
    updateAlgorithmMastery(algorithm, progress, practiceCount = 1) {
        if (!this.learningData.algorithmMastery[algorithm]) {
            this.learningData.algorithmMastery[algorithm] = {
                level: 0,
                practiceCount: 0,
                lastPractice: new Date().toISOString().split('T')[0]
            };
        }

        this.learningData.algorithmMastery[algorithm].level = Math.min(progress, 100);
        this.learningData.algorithmMastery[algorithm].practiceCount += practiceCount;
        this.learningData.algorithmMastery[algorithm].lastPractice = new Date().toISOString().split('T')[0];

        this.saveLearningData();
        this.updateCharts();
    }

    // 添加学习活动
    addActivity(activity, type, duration) {
        this.learningData.activityLog.unshift({
            date: new Date().toISOString().split('T')[0],
            activity: activity,
            type: type,
            duration: duration
        });

        // 保持最近50条活动记录
        if (this.learningData.activityLog.length > 50) {
            this.learningData.activityLog.pop();
        }

        this.saveLearningData();
    }

    // 获取学习统计
    getLearningStats() {
        return this.calculateStats();
    }

    // 清理资源
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        this.charts.forEach(chart => {
            chart.destroy();
        });
        this.charts.clear();

        this.learningData = {};
        this.isInitialized = false;

        console.log('学习分析模块清理完成');
    }
}