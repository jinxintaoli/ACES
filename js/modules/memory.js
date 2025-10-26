import { Utils } from './utils.js';

export class MemoryVisualizationManager {
    constructor() {
        this.utils = new Utils();
        this.isInitialized = false;
        this.memoryBlocks = [];
        this.memoryStats = {
            totalAllocated: 0,
            totalFreed: 0,
            currentUsage: 0,
            fragmentation: 0,
            allocationCount: 0,
            freeCount: 0
        };
        this.nextAddress = 0x1000;
        this.memoryPool = new Array(1024).fill(null); // 1KB 内存池
        this.animationInterval = null;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 设置事件监听器
            this.setupEventListeners();

            // 初始化内存可视化
            this.initializeMemoryVisualization();

            // 启动统计更新
            this.startStatsUpdate();

            this.isInitialized = true;
            console.log('内存可视化模块初始化完成');

        } catch (error) {
            console.error('内存可视化模块初始化失败:', error);
            throw error;
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (event) => {
            switch (event.target.id) {
                case 'allocate-memory':
                    this.allocateMemory();
                    break;
                case 'free-memory':
                    this.freeMemory();
                    break;
                case 'clear-memory':
                    this.clearMemory();
                    break;
                case 'defragment-memory':
                    this.defragmentMemory();
                    break;
                case 'run-garbage-collector':
                    this.runGarbageCollection();
                    break;
                case 'stress-test':
                    this.runStressTest();
                    break;
            }
        });

        // 内存分配选项
        document.addEventListener('change', (event) => {
            if (event.target.id === 'allocation-size') {
                this.updateAllocationSize();
            } else if (event.target.id === 'allocation-type') {
                this.updateAllocationType();
            }
        });
    }

    initializeMemoryVisualization() {
        this.updateMemoryVisualization();
        this.updateMemoryStats();
        this.createMemoryMap();
    }

    startStatsUpdate() {
        this.animationInterval = setInterval(() => {
            this.updateMemoryStats();
        }, 1000);
    }

    allocateMemory() {
        const size = parseInt(document.getElementById('allocation-size')?.value) ||
                     Math.floor(Math.random() * 8) + 1;
        const type = document.getElementById('allocation-type')?.value || 'auto';

        if (this.memoryStats.currentUsage + size > this.memoryPool.length) {
            this.showMemoryAlert('内存不足！无法分配更多内存。');
            return;
        }

        const blockId = this.memoryBlocks.length;
        const address = this.findFreeAddress(size);

        if (address === -1) {
            this.showMemoryAlert('内存碎片化严重，无法找到连续空间！');
            return;
        }

        const block = {
            id: blockId,
            address: address,
            size: size,
            content: this.generateBlockContent(type),
            type: type,
            allocated: true,
            timestamp: Date.now(),
            color: this.getBlockColor(type)
        };

        this.memoryBlocks.push(block);

        // 标记内存池中的占用位置
        for (let i = address; i < address + size; i++) {
            if (i < this.memoryPool.length) {
                this.memoryPool[i] = blockId;
            }
        }

        this.memoryStats.totalAllocated += size;
        this.memoryStats.currentUsage += size;
        this.memoryStats.allocationCount++;

        this.updateMemoryVisualization();
        this.updateMemoryStats();
        this.showMemoryMessage(`已分配 ${size} 单位内存 (地址: 0x${address.toString(16)})`);
    }

    freeMemory() {
        if (this.memoryBlocks.length === 0) {
            this.showMemoryAlert('没有可释放的内存块！');
            return;
        }

        // 释放最后一个分配的内存块
        const lastIndex = this.memoryBlocks.length - 1;
        const block = this.memoryBlocks[lastIndex];

        if (block.allocated) {
            block.allocated = false;
            block.freedTimestamp = Date.now();

            // 清除内存池中的标记
            for (let i = block.address; i < block.address + block.size; i++) {
                if (i < this.memoryPool.length) {
                    this.memoryPool[i] = null;
                }
            }

            this.memoryStats.totalFreed += block.size;
            this.memoryStats.currentUsage -= block.size;
            this.memoryStats.freeCount++;

            this.updateMemoryVisualization();
            this.updateMemoryStats();
            this.showMemoryMessage(`已释放内存块 ${block.id} (${block.size} 单位)`);
        } else {
            this.showMemoryAlert('该内存块已被释放！');
        }
    }

    clearMemory() {
        this.memoryBlocks = [];
        this.memoryPool.fill(null);
        this.nextAddress = 0x1000;

        this.memoryStats = {
            totalAllocated: 0,
            totalFreed: 0,
            currentUsage: 0,
            fragmentation: 0,
            allocationCount: 0,
            freeCount: 0
        };

        this.updateMemoryVisualization();
        this.updateMemoryStats();
        this.showMemoryMessage('内存已清空');
    }

    defragmentMemory() {
        let currentAddress = 0x1000;

        this.memoryBlocks.forEach(block => {
            if (block.allocated) {
                // 更新内存池
                for (let i = block.address; i < block.address + block.size; i++) {
                    if (i < this.memoryPool.length) {
                        this.memoryPool[i] = null;
                    }
                }

                block.address = currentAddress;

                for (let i = currentAddress; i < currentAddress + block.size; i++) {
                    if (i < this.memoryPool.length) {
                        this.memoryPool[i] = block.id;
                    }
                }

                currentAddress += block.size;
            }
        });

        this.nextAddress = currentAddress;
        this.updateMemoryVisualization();
        this.updateMemoryStats();
        this.showMemoryMessage('内存碎片整理完成');
    }

    runGarbageCollection() {
        const beforeCount = this.memoryBlocks.length;

        // 移除已释放的内存块
        this.memoryBlocks = this.memoryBlocks.filter(block => block.allocated);

        const afterCount = this.memoryBlocks.length;
        const collected = beforeCount - afterCount;

        this.updateMemoryVisualization();
        this.updateMemoryStats();
        this.showMemoryMessage(`垃圾回收完成，回收了 ${collected} 个内存块`);
    }

    runStressTest() {
        this.showMemoryMessage('开始内存压力测试...');

        let allocations = 0;
        const testInterval = setInterval(() => {
            if (allocations < 20 && this.memoryStats.currentUsage < this.memoryPool.length * 0.8) {
                this.allocateMemory();
                allocations++;
            } else {
                clearInterval(testInterval);
                setTimeout(() => {
                    this.showMemoryMessage('压力测试完成');
                }, 1000);
            }
        }, 200);
    }

    findFreeAddress(size) {
        // 首次适应算法
        let freeStart = -1;
        let freeCount = 0;

        for (let i = 0x1000; i < this.memoryPool.length; i++) {
            if (this.memoryPool[i] === null) {
                if (freeStart === -1) {
                    freeStart = i;
                }
                freeCount++;

                if (freeCount >= size) {
                    return freeStart;
                }
            } else {
                freeStart = -1;
                freeCount = 0;
            }
        }

        return -1; // 没有找到足够的连续空间
    }

    generateBlockContent(type) {
        const contents = {
            'int': `int_var_${this.memoryBlocks.length}`,
            'float': `float_var_${this.memoryBlocks.length}`,
            'array': `arr[${Math.floor(Math.random() * 10) + 1}]`,
            'object': `obj_${this.memoryBlocks.length}`,
            'string': `str_${this.memoryBlocks.length}`,
            'auto': `var_${this.memoryBlocks.length}`
        };

        return contents[type] || contents.auto;
    }

    getBlockColor(type) {
        const colors = {
            'int': '#3498db',
            'float': '#9b59b6',
            'array': '#2ecc71',
            'object': '#e74c3c',
            'string': '#f39c12',
            'auto': '#34495e'
        };

        return colors[type] || colors.auto;
    }

    updateMemoryVisualization() {
        const container = document.getElementById('memory-visualization');
        if (!container) return;

        container.innerHTML = '';

        // 创建内存映射可视化
        const memoryMap = document.createElement('div');
        memoryMap.className = 'memory-map';

        for (let i = 0; i < this.memoryPool.length; i += 16) {
            const row = document.createElement('div');
            row.className = 'memory-row';

            // 地址标签
            const addressLabel = document.createElement('div');
            addressLabel.className = 'memory-address-label';
            addressLabel.textContent = `0x${(0x1000 + i).toString(16)}`;
            row.appendChild(addressLabel);

            // 内存单元
            for (let j = 0; j < 16 && i + j < this.memoryPool.length; j++) {
                const cell = document.createElement('div');
                cell.className = 'memory-cell';

                const blockId = this.memoryPool[i + j];
                if (blockId !== null) {
                    const block = this.memoryBlocks[blockId];
                    if (block) {
                        cell.style.backgroundColor = block.color;
                        cell.title = `${block.content} (${block.size} units)`;
                    }
                }

                row.appendChild(cell);
            }

            memoryMap.appendChild(row);
        }

        container.appendChild(memoryMap);

        // 创建内存块列表
        this.createMemoryBlockList();
    }

    createMemoryBlockList() {
        const listContainer = document.getElementById('memory-block-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        this.memoryBlocks.forEach(block => {
            const blockElement = document.createElement('div');
            blockElement.className = `memory-block-item ${block.allocated ? 'allocated' : 'freed'}`;
            blockElement.innerHTML = `
                <div class="block-header">
                    <span class="block-id">块 ${block.id}</span>
                    <span class="block-status">${block.allocated ? '已分配' : '已释放'}</span>
                </div>
                <div class="block-details">
                    <div>地址: 0x${block.address.toString(16)}</div>
                    <div>大小: ${block.size} 单位</div>
                    <div>类型: ${block.type}</div>
                    <div>内容: ${block.content}</div>
                    ${!block.allocated ? `<div>释放时间: ${new Date(block.freedTimestamp).toLocaleTimeString()}</div>` : ''}
                </div>
                <div class="block-color" style="background-color: ${block.color}"></div>
            `;

            listContainer.appendChild(blockElement);
        });
    }

    createMemoryMap() {
        const mapContainer = document.getElementById('memory-map-container');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="memory-map-legend">
                <h5>内存图例</h5>
                <div class="legend-items">
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #3498db"></div>
                        <span>整型变量</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #9b59b6"></div>
                        <span>浮点变量</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #2ecc71"></div>
                        <span>数组</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #e74c3c"></div>
                        <span>对象</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #f39c12"></div>
                        <span>字符串</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #bdc3c7"></div>
                        <span>空闲内存</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateMemoryStats() {
        const statsElement = document.getElementById('memory-stats');
        if (!statsElement) return;

        // 计算碎片率
        const fragmentation = this.calculateFragmentation();
        this.memoryStats.fragmentation = fragmentation;

        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${this.memoryStats.currentUsage}</div>
                    <div class="stat-label">当前使用</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.memoryPool.length - this.memoryStats.currentUsage}</div>
                    <div class="stat-label">可用内存</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${fragmentation.toFixed(1)}%</div>
                    <div class="stat-label">碎片率</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.memoryBlocks.filter(b => b.allocated).length}</div>
                    <div class="stat-label">活动块数</div>
                </div>
            </div>

            <div class="detailed-stats">
                <h5>详细统计</h5>
                <table>
                    <tr>
                        <td>总分配:</td>
                        <td>${this.memoryStats.totalAllocated} 单位</td>
                    </tr>
                    <tr>
                        <td>总释放:</td>
                        <td>${this.memoryStats.totalFreed} 单位</td>
                    </tr>
                    <tr>
                        <td>分配次数:</td>
                        <td>${this.memoryStats.allocationCount}</td>
                    </tr>
                    <tr>
                        <td>释放次数:</td>
                        <td>${this.memoryStats.freeCount}</td>
                    </tr>
                    <tr>
                        <td>内存效率:</td>
                        <td>${((this.memoryStats.currentUsage / this.memoryPool.length) * 100).toFixed(1)}%</td>
                    </tr>
                </table>
            </div>
        `;

        this.utils.setSafeHTML(statsElement, statsHTML);

        // 更新内存使用图表
        this.updateMemoryUsageChart();
    }

    calculateFragmentation() {
        let freeBlocks = 0;
        let totalFreeSpace = 0;
        let currentBlock = null;

        for (let i = 0; i < this.memoryPool.length; i++) {
            if (this.memoryPool[i] === null) {
                totalFreeSpace++;
                if (currentBlock === null || currentBlock !== 'free') {
                    freeBlocks++;
                    currentBlock = 'free';
                }
            } else {
                currentBlock = 'used';
            }
        }

        if (totalFreeSpace === 0) return 0;

        const avgFreeBlockSize = totalFreeSpace / freeBlocks;
        const maxPossibleFreeBlocks = this.memoryPool.length;

        return ((freeBlocks - 1) / maxPossibleFreeBlocks) * 100;
    }

    updateMemoryUsageChart() {
        const ctx = document.getElementById('memory-usage-chart');
        if (!ctx) return;

        // 简单的使用率显示
        const used = this.memoryStats.currentUsage;
        const free = this.memoryPool.length - used;

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['已使用', '空闲'],
                datasets: [{
                    data: [used, free],
                    backgroundColor: ['#e74c3c', '#2ecc71'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} 单位 (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    showMemoryMessage(message) {
        const messageElement = document.getElementById('memory-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = 'memory-message show';

            setTimeout(() => {
                messageElement.className = 'memory-message';
            }, 3000);
        }
    }

    showMemoryAlert(message) {
        alert(`内存管理: ${message}`);
    }

    updateAllocationSize() {
        // 更新分配大小显示
        const sizeDisplay = document.getElementById('allocation-size-display');
        const sizeValue = document.getElementById('allocation-size')?.value;

        if (sizeDisplay && sizeValue) {
            sizeDisplay.textContent = `${sizeValue} 单位`;
        }
    }

    updateAllocationType() {
        // 可以在这里添加类型相关的逻辑
    }

    // 导出内存状态
    exportMemoryState() {
        const state = {
            timestamp: new Date().toISOString(),
            memoryBlocks: this.memoryBlocks,
            memoryStats: this.memoryStats,
            memoryPool: this.memoryPool
        };

        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `memory-state-${new Date().getTime()}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }

    // 导入内存状态
    importMemoryState(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const state = JSON.parse(e.target.result);
                this.loadMemoryState(state);
                this.showMemoryMessage('内存状态导入成功');
            } catch (error) {
                this.showMemoryAlert('导入失败: 文件格式错误');
            }
        };
        reader.readAsText(file);
    }

    loadMemoryState(state) {
        this.memoryBlocks = state.memoryBlocks || [];
        this.memoryStats = state.memoryStats || {};
        this.memoryPool = state.memoryPool || new Array(1024).fill(null);

        this.updateMemoryVisualization();
        this.updateMemoryStats();
    }

    // 获取当前内存状态
    getMemoryState() {
        return {
            memoryBlocks: this.memoryBlocks,
            memoryStats: this.memoryStats,
            memoryPool: this.memoryPool
        };
    }

    // 清理资源
    cleanup() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        this.memoryBlocks = [];
        this.memoryPool.fill(null);
        this.isInitialized = false;

        console.log('内存可视化模块清理完成');
    }
}