/**
 * Cytoscape 动态加载器
 * 负责按需加载 Cytoscape 及其布局插件
 */

class CytoscapeLoader {
    constructor() {
        this.isLoaded = false;
        this.isLoading = false;
        this.callbacks = [];
        this.loadedExtensions = new Set();
        this.cyInstances = new Map();
    }

    /**
     * 加载 Cytoscape 核心库
     */
    async loadCore() {
        if (this.isLoaded) return Promise.resolve();
        if (this.isLoading) return new Promise(resolve => this.callbacks.push(resolve));

        this.isLoading = true;

        try {
            // 加载 Cytoscape
            await this.loadJS('https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js');

            this.isLoaded = true;
            this.isLoading = false;

            // 执行所有等待的回调
            this.callbacks.forEach(callback => callback());
            this.callbacks = [];

            console.log('Cytoscape 核心库加载完成');
            return true;
        } catch (error) {
            this.isLoading = false;
            console.error('Cytoscape 核心库加载失败:', error);
            throw error;
        }
    }

    /**
     * 加载布局扩展
     * @param {string} layout - 布局名称
     */
    async loadLayout(layout) {
        await this.loadCore();

        const layoutMap = {
            'dagre': {
                js: [
                    'https://cdnjs.cloudflare.com/ajax/libs/dagre/0.8.5/dagre.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-dagre/2.5.0/cytoscape-dagre.min.js'
                ]
            },
            'cose-bilkent': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-cose-bilkent/4.1.0/cytoscape-cose-bilkent.min.js'
            },
            'cola': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-cola/2.5.0/cytoscape-cola.min.js'
            },
            'avsdf': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-avsdf/1.0.0/cytoscape-avsdf.min.js'
            },
            'spread': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-spread/1.3.0/cytoscape-spread.min.js'
            },
            'euler': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-euler/1.2.1/cytoscape-euler.min.js'
            },
            'breadthfirst': {
                // 内置布局，无需额外加载
            },
            'circle': {
                // 内置布局，无需额外加载
            },
            'concentric': {
                // 内置布局，无需额外加载
            },
            'grid': {
                // 内置布局，无需额外加载
            },
            'random': {
                // 内置布局，无需额外加载
            }
        };

        if (!layoutMap[layout]) {
            throw new Error(`未知的 Cytoscape 布局: ${layout}`);
        }

        if (this.loadedExtensions.has(`layout-${layout}`) || !layoutMap[layout].js) {
            return;
        }

        try {
            const config = layoutMap[layout];
            const jsFiles = Array.isArray(config.js) ? config.js : [config.js];

            for (const jsFile of jsFiles) {
                await this.loadJS(jsFile);
            }

            this.loadedExtensions.add(`layout-${layout}`);
            console.log(`Cytoscape 布局 ${layout} 加载完成`);
        } catch (error) {
            console.error(`Cytoscape 布局 ${layout} 加载失败:`, error);
            throw error;
        }
    }

    /**
     * 加载扩展功能
     * @param {string} extension - 扩展名称
     */
    async loadExtension(extension) {
        await this.loadCore();

        const extensionMap = {
            'context-menus': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-context-menus/4.1.0/cytoscape-context-menus.min.js',
                css: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-context-menus/4.1.0/cytoscape-context-menus.css'
            },
            'qtip': {
                js: [
                    'https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-qtip/2.8.0/cytoscape-qtip.min.js'
                ],
                css: 'https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.css'
            },
            'edgehandles': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-edgehandles/3.5.2/cytoscape-edgehandles.min.js'
            },
            'panzoom': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-panzoom/2.5.3/cytoscape-panzoom.min.js',
                css: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-panzoom/2.5.3/cytoscape-panzoom.css'
            },
            'grid-guide': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-grid-guide/2.3.2/cytoscape-grid-guide.min.js'
            },
            'undo-redo': {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/cytoscape-undo-redo/1.0.3/cytoscape-undo-redo.min.js'
            }
        };

        if (!extensionMap[extension]) {
            throw new Error(`未知的 Cytoscape 扩展: ${extension}`);
        }

        if (this.loadedExtensions.has(extension)) {
            return;
        }

        try {
            const config = extensionMap[extension];

            if (config.css) {
                await this.loadCSS(config.css);
            }

            const jsFiles = Array.isArray(config.js) ? config.js : [config.js];
            for (const jsFile of jsFiles) {
                await this.loadJS(jsFile);
            }

            this.loadedExtensions.add(extension);
            console.log(`Cytoscape 扩展 ${extension} 加载完成`);
        } catch (error) {
            console.error(`Cytoscape 扩展 ${extension} 加载失败:`, error);
            throw error;
        }
    }

    /**
     * 创建 Cytoscape 实例
     * @param {HTMLElement} container - 容器元素
     * @param {Object} options - 配置选项
     */
    async createCy(container, options = {}) {
        await this.loadCore();

        // 加载默认布局和扩展
        const defaultLayout = options.layout?.name || 'dagre';
        await this.loadLayout(defaultLayout);

        if (options.enablePanzoom !== false) {
            await this.loadExtension('panzoom');
        }

        // 合并默认选项
        const defaultOptions = {
            container: container,
            style: this.getDefaultStyle(),
            layout: {
                name: defaultLayout,
                rankDir: 'TB',
                spacingFactor: 1.5,
                nodeSep: 50,
                rankSep: 100,
                animate: true,
                animationDuration: 1000
            },
            minZoom: 0.1,
            maxZoom: 3.0,
            wheelSensitivity: 0.1,
            boxSelectionEnabled: true,
            autounselectify: false
        };

        const cyOptions = this.deepMerge(defaultOptions, options);
        const cy = cytoscape(cyOptions);

        // 存储实例引用
        const instanceId = 'cy-' + Date.now();
        this.cyInstances.set(instanceId, cy);

        // 初始化扩展
        await this.initializeExtensions(cy, options);

        return {
            instance: cy,
            id: instanceId,
            destroy: () => this.destroyInstance(instanceId)
        };
    }

    /**
     * 初始化扩展功能
     * @param {Object} cy - Cytoscape 实例
     * @param {Object} options - 配置选项
     */
    async initializeExtensions(cy, options) {
        // 初始化平移缩放控件
        if (options.enablePanzoom !== false && window.cytoscapePanzoom) {
            cy.panzoom = cy.panzoom({
                zoomFactor: 0.05,
                minZoom: 0.1,
                maxZoom: 3.0,
                fitPadding: 50,
                panSpeed: 10,
                panDistance: 10,
                panDragAreaSize: 75,
                panMinPercentSpeed: 0.25,
                panInactiveArea: 8,
                panIndicatorMinOpacity: 0.5,
                zoomOnly: false
            });
        }

        // 初始化网格引导
        if (options.enableGridGuide && window.cytoscapeGridGuide) {
            cy.gridGuide = cy.gridGuide({
                snapToGridOnRelease: true,
                snapToGridDuringDrag: false,
                snapToAlignmentLocationOnRelease: false,
                snapToAlignmentLocationDuringDrag: false,
                distributionGuidelines: false,
                geometricGuideline: false,
                initPosAlignment: false,
                centerToEdgeAlignment: false,
                resize: false,
                parentSpacing: -1
            });
        }

        // 初始化撤销重做
        if (options.enableUndoRedo && window.cytoscapeUndoRedo) {
            cy.undoRedo = cy.undoRedo();
        }
    }

    /**
     * 获取默认样式
     */
    getDefaultStyle() {
        return [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'color': '#fff',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '12px',
                    'font-weight': 'bold',
                    'width': '80px',
                    'height': '40px',
                    'border-width': '2px',
                    'text-wrap': 'wrap',
                    'text-max-width': '70px',
                    'text-outline-width': 2,
                    'text-outline-color': '#2c3e50'
                }
            },
            {
                selector: 'node[type = "start"]',
                style: {
                    'background-color': '#2ecc71',
                    'border-color': '#27ae60',
                    'shape': 'ellipse'
                }
            },
            {
                selector: 'node[type = "end"]',
                style: {
                    'background-color': '#e74c3c',
                    'border-color': '#c0392b',
                    'shape': 'ellipse'
                }
            },
            {
                selector: 'node[type = "process"]',
                style: {
                    'background-color': '#3498db',
                    'border-color': '#2980b9',
                    'shape': 'round-rectangle'
                }
            },
            {
                selector: 'node[type = "decision"]',
                style: {
                    'background-color': '#f39c12',
                    'border-color': '#e67e22',
                    'shape': 'diamond'
                }
            },
            {
                selector: 'node[type = "input"]',
                style: {
                    'background-color': '#9b59b6',
                    'border-color': '#8e44ad',
                    'shape': 'parallelogram'
                }
            },
            {
                selector: 'node[type = "output"]',
                style: {
                    'background-color': '#1abc9c',
                    'border-color': '#16a085',
                    'shape': 'parallelogram'
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'border-width': '4px',
                    'border-color': '#f1c40f',
                    'background-color': '#34495e'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#7f8c8d',
                    'target-arrow-color': '#7f8c8d',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'arrow-scale': 1.2,
                    'label': 'data(label)',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -10,
                    'font-size': '10px',
                    'color': '#2c3e50'
                }
            },
            {
                selector: 'edge:selected',
                style: {
                    'width': 4,
                    'line-color': '#f1c40f',
                    'target-arrow-color': '#f1c40f'
                }
            },
            {
                selector: 'node:hover',
                style: {
                    'border-width': '3px',
                    'border-color': '#f1c40f'
                }
            },
            {
                selector: 'edge:hover',
                style: {
                    'width': 4,
                    'line-color': '#34495e'
                }
            },
            {
                selector: '.highlighted',
                style: {
                    'border-width': '3px',
                    'border-color': '#e74c3c',
                    'background-color': '#e74c3c'
                }
            },
            {
                selector: '.neighbor',
                style: {
                    'border-width': '3px',
                    'border-color': '#3498db'
                }
            },
            {
                selector: '.semitransparent',
                style: {
                    'opacity': 0.2
                }
            },
            {
                selector: '.search-result',
                style: {
                    'background-color': '#f1c40f',
                    'border-color': '#f39c12'
                }
            }
        ];
    }

    /**
     * 创建流程图元素数据
     * @param {Object} config - 流程图配置
     */
    createFlowchartElements(config = {}) {
        const defaultElements = {
            nodes: [
                { data: { id: 'start', label: '开始', type: 'start' } },
                { data: { id: 'process1', label: '处理过程1', type: 'process' } },
                { data: { id: 'decision1', label: '判断条件', type: 'decision' } },
                { data: { id: 'process2', label: '处理过程2', type: 'process' } },
                { data: { id: 'end', label: '结束', type: 'end' } }
            ],
            edges: [
                { data: { id: 'e1', source: 'start', target: 'process1' } },
                { data: { id: 'e2', source: 'process1', target: 'decision1' } },
                { data: { id: 'e3', source: 'decision1', target: 'process2', label: '是' } },
                { data: { id: 'e4', source: 'decision1', target: 'end', label: '否' } },
                { data: { id: 'e5', source: 'process2', target: 'end' } }
            ]
        };

        return this.deepMerge(defaultElements, config);
    }

    /**
     * 创建 ACES 系统架构图元素
     */
    createAcesArchitectureElements() {
        return {
            nodes: [
                // 输入层节点
                { data: { id: 'input', label: '输入层', type: 'layer', width: 150, height: 80 } },
                { data: { id: 'i1', label: '问题分析', parent: 'input', type: 'process' } },
                { data: { id: 'i2', label: '问题转化', parent: 'input', type: 'process' } },
                { data: { id: 'i3', label: '问题建模', parent: 'input', type: 'process' } },
                { data: { id: 'i4', label: '问题编码', parent: 'input', type: 'process' } },

                // ACES核心引擎节点
                { data: { id: 'ace', label: 'ACES核心引擎', type: 'layer', width: 150, height: 80 } },
                { data: { id: 'c1', label: '算法可行性评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c2', label: '计算效率评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c3', label: '时间复杂度评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c4', label: '空间复杂度评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c5', label: '系统稳定性评估', parent: 'ace', type: 'evaluation' } },

                // 算法节点
                { data: { id: 'algorithms', label: '算法选择', type: 'layer', width: 150, height: 80 } },
                { data: { id: 'a1', label: '深度优先搜索\nDFS', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a2', label: '广度优先搜索\nBFS', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a3', label: '动态规划\nDP', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a4', label: '滑动窗口', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a5', label: '最短路径', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a6', label: '排序算法', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a7', label: '图算法', parent: 'algorithms', type: 'algorithm' } },

                // 输出层节点
                { data: { id: 'output', label: '输出与验证', type: 'layer', width: 150, height: 80 } },
                { data: { id: 'o1', label: '重新校验', parent: 'output', type: 'validation' } },
                { data: { id: 'o2', label: '输出优化', parent: 'output', type: 'optimization' } },
                { data: { id: 'o3', label: '输出验证', parent: 'output', type: 'validation' } },
                { data: { id: 'o4', label: '测试用例', parent: 'output', type: 'testing' } }
            ],
            edges: [
                // 输入层到核心引擎
                { data: { id: 'e1', source: 'input', target: 'ace' } },

                // 核心引擎内部连接
                { data: { id: 'e2', source: 'c1', target: 'c2' } },
                { data: { id: 'e3', source: 'c1', target: 'c3' } },
                { data: { id: 'e4', source: 'c2', target: 'c4' } },
                { data: { id: 'e5', source: 'c3', target: 'c5' } },

                // 核心引擎到算法选择
                { data: { id: 'e6', source: 'ace', target: 'algorithms' } },

                // 算法选择内部连接
                { data: { id: 'e7', source: 'algorithms', target: 'a1' } },
                { data: { id: 'e8', source: 'algorithms', target: 'a2' } },
                { data: { id: 'e9', source: 'algorithms', target: 'a3' } },
                { data: { id: 'e10', source: 'algorithms', target: 'a4' } },
                { data: { id: 'e11', source: 'algorithms', target: 'a5' } },
                { data: { id: 'e12', source: 'algorithms', target: 'a6' } },
                { data: { id: 'e13', source: 'algorithms', target: 'a7' } },

                // 算法到输出
                { data: { id: 'e14', source: 'a1', target: 'output' } },
                { data: { id: 'e15', source: 'a2', target: 'output' } },
                { data: { id: 'e16', source: 'a3', target: 'output' } },
                { data: { id: 'e17', source: 'a4', target: 'output' } },
                { data: { id: 'e18', source: 'a5', target: 'output' } },
                { data: { id: 'e19', source: 'a6', target: 'output' } },
                { data: { id: 'e20', source: 'a7', target: 'output' } }
            ]
        };
    }

    /**
     * 应用布局
     * @param {Object} cy - Cytoscape 实例
     * @param {Object} layoutOptions - 布局选项
     */
    applyLayout(cy, layoutOptions = {}) {
        const defaultLayout = {
            name: 'dagre',
            rankDir: 'TB',
            spacingFactor: 1.5,
            nodeSep: 50,
            rankSep: 100,
            animate: true,
            animationDuration: 1000
        };

        const layout = cy.layout({ ...defaultLayout, ...layoutOptions });
        return layout.run();
    }

    /**
     * 搜索节点
     * @param {Object} cy - Cytoscape 实例
     * @param {string} query - 搜索查询
     */
    searchNodes(cy, query) {
        if (!query.trim()) {
            cy.elements().removeClass('search-result');
            return [];
        }

        cy.elements().removeClass('search-result');

        const results = cy.nodes().filter(node => {
            const label = node.data('label') || '';
            return label.toLowerCase().includes(query.toLowerCase());
        });

        results.addClass('search-result');

        if (results.length > 0) {
            cy.animate({
                fit: {
                    eles: results,
                    padding: 50
                },
                duration: 1000
            });
        }

        return results;
    }

    /**
     * 导出为图片
     * @param {Object} cy - Cytoscape 实例
     * @param {string} format - 图片格式
     * @param {Object} options - 导出选项
     */
    exportAsImage(cy, format = 'png', options = {}) {
        const defaultOptions = {
            maxWidth: 4000,
            maxHeight: 4000,
            scale: 2,
            quality: 1,
            bg: 'white',
            full: true
        };

        const exportOptions = { ...defaultOptions, ...options };
        const png64 = cy.png(exportOptions);

        // 创建下载链接
        const link = document.createElement('a');
        link.download = `cytoscape-export-${new Date().getTime()}.${format}`;
        link.href = png64;
        link.click();

        return png64;
    }

    /**
     * 重置视图
     * @param {Object} cy - Cytoscape 实例
     */
    resetView(cy) {
        cy.animate({
            fit: {
                eles: cy.elements(),
                padding: 50
            },
            duration: 1000
        });

        // 清除选择和高亮
        cy.elements().unselect();
        cy.elements().removeClass('highlighted');
        cy.elements().removeClass('neighbor');
        cy.elements().removeClass('semitransparent');
        cy.elements().removeClass('search-result');
    }

    /**
     * 获取可用布局列表
     */
    getAvailableLayouts() {
        return {
            'dagre': 'Dagre (分层布局)',
            'cose-bilkent': 'CoSE-Bilkent (力导向)',
            'cola': 'Cola (约束布局)',
            'breadthfirst': '广度优先',
            'circle': '圆形布局',
            'concentric': '同心圆布局',
            'grid': '网格布局',
            'random': '随机布局'
        };
    }

    /**
     * 获取节点类型样式映射
     */
    getNodeTypeStyles() {
        return {
            'start': { color: '#2ecc71', shape: 'ellipse' },
            'end': { color: '#e74c3c', shape: 'ellipse' },
            'process': { color: '#3498db', shape: 'round-rectangle' },
            'decision': { color: '#f39c12', shape: 'diamond' },
            'input': { color: '#9b59b6', shape: 'parallelogram' },
            'output': { color: '#1abc9c', shape: 'parallelogram' },
            'layer': { color: '#2c3e50', shape: 'round-rectangle', width: 150, height: 80 },
            'evaluation': { color: '#9b59b6', shape: 'round-rectangle' },
            'algorithm': { color: '#2ecc71', shape: 'ellipse', width: 100, height: 100 },
            'validation': { color: '#e67e22', shape: 'round-rectangle' },
            'optimization': { color: '#e74c3c', shape: 'round-rectangle' },
            'testing': { color: '#1abc9c', shape: 'round-rectangle' }
        };
    }

    /**
     * 销毁实例
     * @param {string} instanceId - 实例ID
     */
    destroyInstance(instanceId) {
        const cy = this.cyInstances.get(instanceId);
        if (cy) {
            cy.destroy();
            this.cyInstances.delete(instanceId);
        }
    }

    /**
     * 深度合并对象
     * @param {Object} target - 目标对象
     * @param {Object} source - 源对象
     */
    deepMerge(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    /**
     * 加载 CSS 文件
     * @param {string} href - CSS 文件地址
     */
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * 加载 JS 文件
     * @param {string} src - JS 文件地址
     */
    loadJS(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 清理资源
     */
    cleanup() {
        // 销毁所有实例
        this.cyInstances.forEach((cy, instanceId) => {
            this.destroyInstance(instanceId);
        });

        this.isLoaded = false;
        this.isLoading = false;
        this.loadedExtensions.clear();
        this.callbacks = [];

        console.log('Cytoscape 加载器清理完成');
    }
}

// 创建全局实例
window.CytoscapeLoader = new CytoscapeLoader();

export default CytoscapeLoader;