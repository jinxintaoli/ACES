import { Utils } from './utils.js';

export class ComplexityAnalysisManager {
    constructor() {
        this.utils = new Utils();
        this.isInitialized = false;
        this.currentAnalysis = null;
        this.complexityChart = null;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 动态加载Chart.js
            await this.loadChartJS();

            // 设置事件监听器
            this.setupEventListeners();

            // 初始化复杂度图表
            this.initializeComplexityChart();

            this.isInitialized = true;
            console.log('复杂度分析模块初始化完成');

        } catch (error) {
            console.error('复杂度分析模块初始化失败:', error);
            throw error;
        }
    }

    async loadChartJS() {
        if (window.Chart) return;

        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js');
    }

    setupEventListeners() {
        // 计算复杂度按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'calculate-complexity') {
                this.handleCalculateComplexity();
            }
        });

        // 代码变化实时分析（防抖）
        const complexityCode = document.getElementById('complexity-code');
        if (complexityCode) {
            complexityCode.addEventListener('input', this.utils.debounce(() => {
                this.analyzeCodeComplexity(complexityCode.value);
            }, 1000));
        }

        // 复杂度类型选择
        document.addEventListener('change', (event) => {
            if (event.target.id === 'complexity-type') {
                this.updateComplexityVisualization();
            }
        });
    }

    initializeComplexityChart() {
        const ctx = document.getElementById('complexity-chart');
        if (!ctx) return;

        this.complexityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['10', '100', '1000', '10000', '100000'],
                datasets: [
                    {
                        label: 'O(1) - 常数时间',
                        data: [1, 1, 1, 1, 1],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'O(log n) - 对数时间',
                        data: [1, 2, 3, 4, 5],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'O(n) - 线性时间',
                        data: [10, 100, 1000, 10000, 100000],
                        borderColor: '#9b59b6',
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'O(n log n) - 线性对数时间',
                        data: [10, 200, 3000, 40000, 500000],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'O(n²) - 平方时间',
                        data: [100, 10000, 1000000, 100000000, 10000000000],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'O(2ⁿ) - 指数时间',
                        data: [1024, 1.2676506e+30, Infinity, Infinity, Infinity],
                        borderColor: '#34495e',
                        backgroundColor: 'rgba(52, 73, 94, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '时间复杂度增长曲线'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    if (context.parsed.y > 1e9) {
                                        label += '> 10^9';
                                    } else {
                                        label += context.parsed.y.toLocaleString();
                                    }
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '输入规模 (n)'
                        },
                        type: 'logarithmic'
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '操作次数'
                        },
                        type: 'logarithmic',
                        min: 1
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    handleCalculateComplexity() {
        const codeTextarea = document.getElementById('complexity-code');
        if (!codeTextarea) return;

        const code = codeTextarea.value;
        this.analyzeCodeComplexity(code);
    }

    analyzeCodeComplexity(code) {
        if (!code.trim()) {
            this.showComplexityResult('请输入代码进行分析');
            return;
        }

        try {
            const analysis = this.performComplexityAnalysis(code);
            this.currentAnalysis = analysis;

            this.displayComplexityResult(analysis);
            this.updateComplexityVisualization();
            this.generateComplexityReport(analysis);

        } catch (error) {
            this.showComplexityResult(`分析错误: ${error.message}`);
        }
    }

    performComplexityAnalysis(code) {
        const analysis = {
            timeComplexity: 'O(1)',
            spaceComplexity: 'O(1)',
            explanation: [],
            codeStructure: [],
            recommendations: [],
            confidence: 1.0,
            patterns: []
        };

        const lines = code.split('\n').filter(line => line.trim());
        let loopDepth = 0;
        let maxLoopDepth = 0;
        let hasRecursion = false;
        let hasDynamicAllocation = false;

        // 分析代码结构
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const structure = {
                line: index + 1,
                content: trimmedLine,
                type: 'statement',
                complexity: 'O(1)'
            };

            // 检测循环
            if (this.isLoop(trimmedLine)) {
                structure.type = 'loop';
                loopDepth++;
                maxLoopDepth = Math.max(maxLoopDepth, loopDepth);

                if (loopDepth === 1) {
                    structure.complexity = 'O(n)';
                } else if (loopDepth === 2) {
                    structure.complexity = 'O(n²)';
                } else {
                    structure.complexity = `O(n^${loopDepth})`;
                }

                analysis.patterns.push('nested-loop');
            }

            // 检测循环结束
            if (trimmedLine.includes('}') && loopDepth > 0) {
                loopDepth--;
            }

            // 检测递归
            if (this.isRecursiveCall(trimmedLine, code)) {
                structure.type = 'recursion';
                structure.complexity = 'O(2ⁿ)';
                hasRecursion = true;
                analysis.patterns.push('recursion');
            }

            // 检测动态内存分配
            if (this.isDynamicAllocation(trimmedLine)) {
                structure.type = 'allocation';
                structure.complexity = 'O(n)';
                hasDynamicAllocation = true;
                analysis.patterns.push('dynamic-allocation');
            }

            // 检测函数调用
            if (this.isFunctionCall(trimmedLine)) {
                structure.type = 'function-call';
            }

            analysis.codeStructure.push(structure);
        });

        // 确定时间复杂度
        if (hasRecursion) {
            analysis.timeComplexity = 'O(2ⁿ)';
            analysis.explanation.push('检测到递归调用，可能是指数时间复杂度');
        } else if (maxLoopDepth >= 2) {
            analysis.timeComplexity = `O(n^${maxLoopDepth})`;
            analysis.explanation.push(`检测到 ${maxLoopDepth} 层嵌套循环`);
        } else if (maxLoopDepth === 1) {
            analysis.timeComplexity = 'O(n)';
            analysis.explanation.push('检测到单层循环');
        } else {
            analysis.timeComplexity = 'O(1)';
            analysis.explanation.push('未检测到循环或递归，可能是常数时间复杂度');
        }

        // 确定空间复杂度
        if (hasDynamicAllocation) {
            analysis.spaceComplexity = 'O(n)';
            analysis.explanation.push('检测到动态内存分配');
        } else {
            analysis.spaceComplexity = 'O(1)';
            analysis.explanation.push('未检测到动态内存分配');
        }

        // 生成优化建议
        this.generateRecommendations(analysis);

        // 计算置信度
        analysis.confidence = this.calculateConfidence(analysis);

        return analysis;
    }

    isLoop(line) {
        return /(for|while|do)\s*\(/.test(line) && !line.includes('//');
    }

    isRecursiveCall(line, fullCode) {
        // 简单的递归检测 - 在实际应用中需要更复杂的分析
        const functionCalls = line.match(/(\w+)\s*\(/g);
        if (!functionCalls) return false;

        return functionCalls.some(call => {
            const functionName = call.replace(/\s*\(/, '');
            return fullCode.includes(` ${functionName}(`) &&
                   !['cout', 'cin', 'printf', 'scanf'].includes(functionName);
        });
    }

    isDynamicAllocation(line) {
        return /(new |malloc|calloc|realloc|vector|resize)/.test(line) && !line.includes('//');
    }

    isFunctionCall(line) {
        return /(\w+)\s*\([^)]*\)/.test(line) &&
               !line.includes('if') &&
               !line.includes('while') &&
               !line.includes('for');
    }

    generateRecommendations(analysis) {
        if (analysis.timeComplexity === 'O(n²)' || analysis.timeComplexity.startsWith('O(n^')) {
            analysis.recommendations.push(
                '考虑使用更高效的算法替代嵌套循环',
                '尝试使用哈希表来优化查找操作',
                '分析是否可以使用动态规划或分治策略'
            );
        }

        if (analysis.timeComplexity === 'O(2ⁿ)') {
            analysis.recommendations.push(
                '递归算法效率较低，考虑使用迭代方法',
                '尝试使用记忆化搜索优化递归',
                '分析问题是否具有最优子结构，考虑动态规划'
            );
        }

        if (analysis.spaceComplexity === 'O(n)') {
            analysis.recommendations.push(
                '考虑是否可以在原地操作，减少空间使用',
                '分析数据结构的空间效率',
                '尝试使用更紧凑的数据表示'
            );
        }

        if (analysis.recommendations.length === 0) {
            analysis.recommendations.push('代码复杂度良好，继续保持！');
        }
    }

    calculateConfidence(analysis) {
        let confidence = 1.0;

        // 基于分析深度调整置信度
        if (analysis.codeStructure.length < 5) {
            confidence *= 0.7;
        }

        // 基于模式检测调整置信度
        if (analysis.patterns.length === 0) {
            confidence *= 0.8;
        }

        return Math.min(confidence, 1.0);
    }

    displayComplexityResult(analysis) {
        const resultElement = document.getElementById('complexity-result');
        if (!resultElement) return;

        let html = `
            <div class="complexity-summary">
                <h4>复杂度分析结果</h4>
                <div class="complexity-metrics">
                    <div class="metric">
                        <span class="metric-label">时间复杂度:</span>
                        <span class="metric-value ${this.getComplexityClass(analysis.timeComplexity)}">
                            ${analysis.timeComplexity}
                        </span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">空间复杂度:</span>
                        <span class="metric-value ${this.getComplexityClass(analysis.spaceComplexity)}">
                            ${analysis.spaceComplexity}
                        </span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">分析置信度:</span>
                        <span class="metric-value">
                            ${(analysis.confidence * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            <div class="complexity-explanation">
                <h5>分析说明</h5>
                <ul>
                    ${analysis.explanation.map(exp => `<li>${exp}</li>`).join('')}
                </ul>
            </div>

            <div class="complexity-recommendations">
                <h5>优化建议</h5>
                <ul>
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;

        // 添加代码结构分析
        if (analysis.codeStructure.length > 0) {
            html += `
                <div class="code-structure">
                    <h5>代码结构分析</h5>
                    <div class="structure-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>行号</th>
                                    <th>代码</th>
                                    <th>类型</th>
                                    <th>复杂度</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${analysis.codeStructure.map(structure => `
                                    <tr>
                                        <td>${structure.line}</td>
                                        <td><code>${this.utils.sanitizeHTML(structure.content)}</code></td>
                                        <td><span class="type-badge type-${structure.type}">${structure.type}</span></td>
                                        <td><span class="complexity-badge">${structure.complexity}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        this.utils.setSafeHTML(resultElement, html);
    }

    getComplexityClass(complexity) {
        const complexityMap = {
            'O(1)': 'complexity-good',
            'O(log n)': 'complexity-good',
            'O(n)': 'complexity-fair',
            'O(n log n)': 'complexity-fair',
            'O(n²)': 'complexity-poor',
            'O(2ⁿ)': 'complexity-bad'
        };

        return complexityMap[complexity] || 'complexity-unknown';
    }

    updateComplexityVisualization() {
        if (!this.complexityChart || !this.currentAnalysis) return;

        // 高亮当前分析的复杂度曲线
        const datasetIndex = this.getComplexityDatasetIndex(this.currentAnalysis.timeComplexity);

        this.complexityChart.data.datasets.forEach((dataset, index) => {
            dataset.borderWidth = index === datasetIndex ? 3 : 1;
            dataset.pointRadius = index === datasetIndex ? 5 : 0;
        });

        this.complexityChart.update();
    }

    getComplexityDatasetIndex(complexity) {
        const complexityMap = {
            'O(1)': 0,
            'O(log n)': 1,
            'O(n)': 2,
            'O(n log n)': 3,
            'O(n²)': 4,
            'O(2ⁿ)': 5
        };

        return complexityMap[complexity] || 0;
    }

    generateComplexityReport(analysis) {
        const reportElement = document.getElementById('complexity-report');
        if (!reportElement) return;

        const report = `
复杂度分析报告
生成时间: ${new Date().toLocaleString()}

总体评估:
- 时间复杂度: ${analysis.timeComplexity}
- 空间复杂度: ${analysis.spaceComplexity}
- 分析置信度: ${(analysis.confidence * 100).toFixed(1)}%

详细分析:
${analysis.explanation.map(exp => `• ${exp}`).join('\n')}

检测到的模式:
${analysis.patterns.length > 0 ? analysis.patterns.map(pattern => `• ${pattern}`).join('\n') : '• 无特殊模式'}

优化建议:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

代码结构摘要:
总行数: ${analysis.codeStructure.length}
循环结构: ${analysis.codeStructure.filter(s => s.type === 'loop').length}
函数调用: ${analysis.codeStructure.filter(s => s.type === 'function-call').length}
内存分配: ${analysis.codeStructure.filter(s => s.type === 'allocation').length}
        `.trim();

        reportElement.textContent = report;
    }

    showComplexityResult(message) {
        const resultElement = document.getElementById('complexity-result');
        if (resultElement) {
            resultElement.innerHTML = `<div class="complexity-message">${message}</div>`;
        }
    }

    // 导出分析报告
    exportAnalysisReport() {
        if (!this.currentAnalysis) {
            alert('请先进行复杂度分析');
            return;
        }

        const report = this.generateExportReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `complexity-analysis-${new Date().getTime()}.txt`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }

    generateExportReport() {
        const analysis = this.currentAnalysis;
        return `ACES 系统 - 复杂度分析报告
====================================

分析时间: ${new Date().toLocaleString()}
代码行数: ${analysis.codeStructure.length}

复杂度总结:
------------
时间复杂度: ${analysis.timeComplexity}
空间复杂度: ${analysis.spaceComplexity}
置信度: ${(analysis.confidence * 100).toFixed(1)}%

详细分析:
---------
${analysis.explanation.map(exp => `• ${exp}`).join('\n')}

优化建议:
---------
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

代码结构分析:
-------------
${analysis.codeStructure.map(structure =>
    `行 ${structure.line.toString().padStart(3)}: [${structure.type.padEnd(12)}] ${structure.complexity.padEnd(8)} ${structure.content}`
).join('\n')}

检测模式:
---------
${analysis.patterns.length > 0 ? analysis.patterns.join(', ') : '无特殊模式'}

====================================
ACES 系统 - 信息学竞赛万能引擎
        `;
    }

    // 获取当前分析结果
    getCurrentAnalysis() {
        return this.currentAnalysis;
    }

    // 清理资源
    cleanup() {
        if (this.complexityChart) {
            this.complexityChart.destroy();
            this.complexityChart = null;
        }

        this.currentAnalysis = null;
        this.isInitialized = false;

        console.log('复杂度分析模块清理完成');
    }
}