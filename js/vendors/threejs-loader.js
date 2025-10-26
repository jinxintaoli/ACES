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
            }
        };

        if (!layoutMap[layout]) {
            throw new Error(`未知的 Cytoscape 布局: ${layout}`);
        }

        if (this.loadedExtensions.has(`layout-${layout}`)) {
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
        await this.loadLayout('dagre');
        await this.loadExtension('panzoom');

        // 合并默认选项
        const defaultOptions = {
            container: container,
            style: this.getDefaultStyle(),
            layout: {
                name: 'dagre',
                rankDir: 'TB',
                spacingFactor: 1.5,
                nodeSep: 50,
                rankSep: 100
            },
            minZoom: 0.1,
            maxZoom: 3.0,
            wheelSensitivity: 0.1
        };

        const cyOptions = { ...defaultOptions, ...options };

        return cytoscape(cyOptions);
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
                    'text-max-width': '70px'
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'border-width': '4px',
                    'border-color': '#f1c40f'
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
                    'arrow-scale': 1.2
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

        return { ...defaultElements, ...config };
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
        this.isLoaded = false;
        this.isLoading = false;
        this.loadedExtensions.clear();
        this.callbacks = [];
    }
}

// 创建全局实例
window.CytoscapeLoader = new CytoscapeLoader();

export default CytoscapeLoader;