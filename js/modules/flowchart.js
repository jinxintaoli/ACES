import { Utils } from './utils.js';

export class FlowchartManager {
    constructor() {
        this.utils = new Utils();
        this.cy = null;
        this.isInitialized = false;
        this.selectedNode = null;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 动态加载Cytoscape
            await this.loadCytoscape();

            // 初始化流程图
            this.initializeFlowchart();

            // 设置事件监听器
            this.setupEventListeners();

            this.isInitialized = true;
            console.log('流程图模块初始化完成');

        } catch (error) {
            console.error('流程图模块初始化失败:', error);
            throw error;
        }
    }

    async loadCytoscape() {
        // 检查是否已加载
        if (window.cytoscape) return;

        // 加载JS
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/dagre/0.8.5/dagre.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/cytoscape-dagre/2.5.0/cytoscape-dagre.min.js');
    }

    initializeFlowchart() {
        const container = document.getElementById('cy');
        if (!container) {
            throw new Error('流程图容器未找到');
        }

        this.cy = cytoscape({
            container: container,
            elements: this.getFlowchartElements(),
            style: this.getFlowchartStyle(),
            layout: this.getFlowchartLayout(),
            minZoom: 0.5,
            maxZoom: 2.0,
            wheelSensitivity: 0.1
        });

        // 应用布局
        this.applyLayout();
    }

    getFlowchartElements() {
        return {
            nodes: [
                // 输入层节点
                { data: { id: 'input', label: '输入层', type: 'layer' } },
                { data: { id: 'i1', label: '问题分析', parent: 'input', type: 'process' } },
                { data: { id: 'i2', label: '问题转化', parent: 'input', type: 'process' } },
                { data: { id: 'i3', label: '问题建模', parent: 'input', type: 'process' } },
                { data: { id: 'i4', label: '问题编码', parent: 'input', type: 'process' } },

                // ACES核心引擎节点
                { data: { id: 'ace', label: 'ACES核心引擎', type: 'layer' } },
                { data: { id: 'c1', label: '算法可行性评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c2', label: '计算效率评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c3', label: '时间复杂度评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c4', label: '空间复杂度评估', parent: 'ace', type: 'evaluation' } },
                { data: { id: 'c5', label: '系统稳定性评估', parent: 'ace', type: 'evaluation' } },

                // 算法节点
                { data: { id: 'algorithms', label: '算法选择', type: 'layer' } },
                { data: { id: 'a1', label: '深度优先搜索\nDFS', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a2', label: '广度优先搜索\nBFS', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a3', label: '动态规划\nDP', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a4', label: '滑动窗口', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a5', label: '最短路径', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a6', label: '排序算法', parent: 'algorithms', type: 'algorithm' } },
                { data: { id: 'a7', label: '图算法', parent: 'algorithms', type: 'algorithm' } },

                // 输出层节点
                { data: { id: 'output', label: '输出与验证', type: 'layer' } },
                { data: { id: 'o1', label: '重新校验', parent: 'output', type: 'validation' } },
                { data: { id: 'o2', label: '输出优化', parent: 'output', type: 'optimization' } },
                { data: { id: 'o3', label: '输出验证', parent: 'output', type: 'validation' } },
                { data: { id: 'o4', label: '测试用例', parent: 'output', type: 'testing' } },

                // 其他节点
                { data: { id: 'm1', label: '模拟训练模块', type: 'module' } },
                { data: { id: 'e1', label: '扩展组件', type: 'module' } },
                { data: { id: 's1', label: '解题步骤', type: 'process' } }
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
                { data: { id: 'e20', source: 'a7', target: 'output' } },

                // 其他连接
                { data: { id: 'e21', source: 'ace', target: 'm1' } },
                { data: { id: 'e22', source: 'e1', target: 'a3' } },
                { data: { id: 'e23', source: 's1', target: 'a4' } }
            ]
        };
    }

    getFlowchartStyle() {
        return [
            // 节点基础样式
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'color': '#fff',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '12px',
                    'font-weight': 'bold',
                    'width': '120px',
                    'height': '60px',
                    'border-width': '2px',
                    'text-wrap': 'wrap',
                    'text-max-width': '100px'
                }
            },

            // 层节点样式
            {
                selector: 'node[type = "layer"]',
                style: {
                    'background-color': '#2c3e50',
                    'border-color': '#34495e',
                    'shape': 'round-rectangle',
                    'width': '150px',
                    'height': '80px',
                    'font-size': '14px'
                }
            },

            // 处理节点样式
            {
                selector: 'node[type = "process"]',
                style: {
                    'background-color': '#3498db',
                    'border-color': '#2980b9'
                }
            },

            // 评估节点样式
            {
                selector: 'node[type = "evaluation"]',
                style: {
                    'background-color': '#9b59b6',
                    'border-color': '#8e44ad'
                }
            },

            // 算法节点样式
            {
                selector: 'node[type = "algorithm"]',
                style: {
                    'background-color': '#2ecc71',
                    'border-color': '#27ae60',
                    'shape': 'ellipse',
                    'width': '100px',
                    'height': '100px'
                }
            },

            // 验证节点样式
            {
                selector: 'node[type = "validation"]',
                style: {
                    'background-color': '#e67e22',
                    'border-color': '#d35400'
                }
            },

            // 优化节点样式
            {
                selector: 'node[type = "optimization"]',
                style: {
                    'background-color': '#e74c3c',
                    'border-color': '#c0392b'
                }
            },

            // 测试节点样式
            {
                selector: 'node[type = "testing"]',
                style: {
                    'background-color': '#1abc9c',
                    'border-color': '#16a085'
                }
            },

            // 模块节点样式
            {
                selector: 'node[type = "module"]',
                style: {
                    'background-color': '#f39c12',
                    'border-color': '#e67e22',
                    'shape': 'diamond',
                    'width': '80px',
                    'height': '80px'
                }
            },

            // 选中节点样式
            {
                selector: 'node:selected',
                style: {
                    'border-width': '4px',
                    'border-color': '#f1c40f'
                }
            },

            // 边样式
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

            // 悬停样式
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

    getFlowchartLayout() {
        return {
            name: 'dagre',
            rankDir: 'TB',
            spacingFactor: 1.5,
            nodeSep: 50,
            rankSep: 100,
            animate: true,
            animationDuration: 1000
        };
    }

    applyLayout() {
        const layout = this.cy.layout(this.getFlowchartLayout());
        layout.run();
    }

    setupEventListeners() {
        // 节点点击事件
        this.cy.on('tap', 'node', (evt) => {
            const node = evt.target;
            this.handleNodeClick(node);
        });

        // 边点击事件
        this.cy.on('tap', 'edge', (evt) => {
            const edge = evt.target;
            this.handleEdgeClick(edge);
        });

        // 画布点击事件（取消选择）
        this.cy.on('tap', (evt) => {
            if (evt.target === this.cy) {
                this.handleCanvasClick();
            }
        });

        // 节点悬停事件
        this.cy.on('mouseover', 'node', (evt) => {
            const node = evt.target;
            this.highlightConnectedElements(node);
        });

        // 节点离开事件
        this.cy.on('mouseout', 'node', (evt) => {
            this.removeHighlights();
        });

        // 缩放和平移事件
        this.cy.on('zoom pan', (evt) => {
            this.handleViewportChange();
        });
    }

    handleNodeClick(node) {
        // 取消之前的选择
        if (this.selectedNode) {
            this.selectedNode.unselect();
        }

        // 选择当前节点
        node.select();
        this.selectedNode = node;

        // 显示节点信息
        this.showNodeInfo(node);

        // 高亮相关元素
        this.highlightConnectedElements(node);
    }

    handleEdgeClick(edge) {
        const source = edge.source();
        const target = edge.target();

        const info = `连接: ${source.data('label')} → ${target.data('label')}`;
        this.showComponentInfo(info);
    }

    handleCanvasClick() {
        if (this.selectedNode) {
            this.selectedNode.unselect();
            this.selectedNode = null;
        }
        this.removeHighlights();
        this.showComponentInfo('点击节点或连接查看详细信息');
    }

    handleViewportChange() {
        // 可以在这里处理视图变化，比如更新导航控件
    }

    highlightConnectedElements(node) {
        // 高亮连接的边
        node.connectedEdges().addClass('highlighted');

        // 高亮相邻节点
        node.neighborhood().nodes().addClass('neighbor');

        // 其他节点降低透明度
        this.cy.nodes().not(node).not(node.neighborhood().nodes())
            .addClass('semitransparent');

        this.cy.edges().not(node.connectedEdges())
            .addClass('semitransparent');
    }

    removeHighlights() {
        this.cy.elements().removeClass('highlighted');
        this.cy.elements().removeClass('neighbor');
        this.cy.elements().removeClass('semitransparent');
    }

    showNodeInfo(node) {
        const nodeData = node.data();
        let info = `
            <h4>${nodeData.label}</h4>
            <p><strong>类型:</strong> ${this.getNodeTypeName(nodeData.type)}</p>
        `;

        if (nodeData.parent) {
            const parent = this.cy.getElementById(nodeData.parent);
            if (parent) {
                info += `<p><strong>所属模块:</strong> ${parent.data().label}</p>`;
            }
        }

        // 添加具体描述
        const description = this.getNodeDescription(nodeData);
        if (description) {
            info += `<p><strong>描述:</strong> ${description}</p>`;
        }

        // 添加入度和出度信息
        const inDegree = node.incomers().nodes().length;
        const outDegree = node.outgoers().nodes().length;
        info += `<p><strong>连接数:</strong> 入度 ${inDegree}, 出度 ${outDegree}</p>`;

        this.showComponentInfo(info);
    }

    getNodeTypeName(type) {
        const typeNames = {
            'layer': '功能层',
            'process': '处理过程',
            'evaluation': '评估模块',
            'algorithm': '算法组件',
            'validation': '验证模块',
            'optimization': '优化模块',
            'testing': '测试模块',
            'module': '扩展模块'
        };
        return typeNames[type] || '未知类型';
    }

    getNodeDescription(nodeData) {
        const descriptions = {
            'i1': '分析问题需求，确定输入输出格式和约束条件',
            'i2': '将实际问题转化为计算机可处理的形式',
            'i3': '建立数学模型，确定算法适用的数据结构',
            'i4': '将问题编码为具体的程序输入',
            'c1': '评估算法是否能在有限时间内解决问题',
            'c2': '分析算法的计算效率和资源消耗',
            'c3': '计算算法的时间复杂度',
            'c4': '计算算法的空间复杂度',
            'c5': '评估算法在不同输入下的稳定性',
            'a1': '深度优先搜索算法，适用于路径查找和连通分量',
            'a2': '广度优先搜索算法，适用于最短路径和层次遍历',
            'a3': '动态规划算法，适用于最优子结构问题',
            'o1': '对输出结果进行重新校验和验证',
            'o2': '优化输出格式和性能',
            'o3': '验证输出结果的正确性',
            'o4': '生成和执行测试用例'
        };
        return descriptions[nodeData.id] || '该组件的详细功能描述';
    }

    showComponentInfo(html) {
        const infoElement = document.getElementById('component-info');
        if (infoElement) {
            this.utils.setSafeHTML(infoElement, html);
        }
    }

    // 搜索节点
    searchNodes(query) {
        if (!query.trim()) {
            this.cy.elements().removeClass('search-result');
            return;
        }

        this.cy.elements().removeClass('search-result');

        const results = this.cy.nodes().filter(node => {
            const label = node.data('label') || '';
            return label.toLowerCase().includes(query.toLowerCase());
        });

        results.addClass('search-result');

        if (results.length > 0) {
            this.cy.animate({
                fit: {
                    eles: results,
                    padding: 50
                },
                duration: 1000
            });
        }
    }

    // 导出为图片
    exportAsImage(format = 'png') {
        const options = {
            maxWidth: 4000,
            maxHeight: 4000,
            scale: 2,
            quality: 1,
            bg: 'white',
            full: true
        };

        const png64 = this.cy.png(options);

        // 创建下载链接
        const link = document.createElement('a');
        link.download = `aces-flowchart-${new Date().getTime()}.${format}`;
        link.href = png64;
        link.click();
    }

    // 重置视图
    resetView() {
        this.cy.animate({
            fit: {
                eles: this.cy.elements(),
                padding: 50
            },
            duration: 1000
        });

        this.handleCanvasClick();
    }

    // 获取当前选中的节点
    getSelectedNode() {
        return this.selectedNode;
    }

    // 清理资源
    cleanup() {
        if (this.cy) {
            this.cy.destroy();
            this.cy = null;
        }

        this.selectedNode = null;
        this.isInitialized = false;
        console.log('流程图模块清理完成');
    }
}