import { Utils } from './utils.js';

export class Visualization3DManager {
    constructor() {
        this.utils = new Utils();
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.isInitialized = false;
        this.animationId = null;
        this.currentStructure = null;

        // 3D对象引用
        this.meshes = new Map();
        this.labels = new Map();
        this.arrows = new Map();
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 动态加载Three.js
            await this.loadThreeJS();

            // 初始化3D场景
            this.initializeScene();

            // 设置事件监听器
            this.setupEventListeners();

            // 开始动画循环
            this.animate();

            // 初始显示链表
            this.showLinkedList();

            this.isInitialized = true;
            console.log('3D可视化模块初始化完成');

        } catch (error) {
            console.error('3D可视化模块初始化失败:', error);
            throw error;
        }
    }

    async loadThreeJS() {
        // 检查是否已加载
        if (window.THREE) return;

        // 加载JS
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    }

    initializeScene() {
        const container = document.getElementById('3d-container');
        if (!container) {
            throw new Error('3D容器未找到');
        }

        const width = container.clientWidth;
        const height = container.clientHeight;

        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f7fa);

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(this.renderer.domElement);

        // 添加光源
        this.setupLighting();

        // 添加坐标轴
        this.setupHelpers();

        // 设置初始相机位置
        this.resetCamera();
    }

    setupLighting() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // 点光源
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, -5, 5);
        this.scene.add(pointLight);
    }

    setupHelpers() {
        // 坐标轴辅助
        const axesHelper = new THREE.AxesHelper(3);
        this.scene.add(axesHelper);

        // 网格辅助
        const gridHelper = new THREE.GridHelper(10, 10);
        gridHelper.rotation.x = Math.PI / 2;
        this.scene.add(gridHelper);
    }

    setupEventListeners() {
        const container = document.getElementById('3d-container');
        if (!container) return;

        // 鼠标控制
        this.setupMouseControls(container);

        // 按钮事件
        document.addEventListener('click', (event) => {
            if (event.target.id === 'show-linked-list') {
                this.showLinkedList();
            } else if (event.target.id === 'show-binary-tree') {
                this.showBinaryTree();
            } else if (event.target.id === 'show-graph') {
                this.showGraph();
            } else if (event.target.id === 'reset-3d') {
                this.resetCamera();
            }
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    setupMouseControls(container) {
        let isMouseDown = false;
        let previousMousePosition = { x: 0, y: 0 };
        let isDragging = false;

        // 鼠标按下
        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            isDragging = false;
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });

        // 鼠标移动
        container.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;

            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            // 判断是否开始拖动
            if (Math.abs(deltaMove.x) > 3 || Math.abs(deltaMove.y) > 3) {
                isDragging = true;
            }

            if (isDragging) {
                // 旋转相机
                this.camera.position.x -= deltaMove.x * 0.01;
                this.camera.position.y += deltaMove.y * 0.01;
                this.camera.lookAt(0, 0, 0);
            }

            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });

        // 鼠标释放
        container.addEventListener('mouseup', () => {
            isMouseDown = false;

            // 如果不是拖动，则处理点击
            if (!isDragging) {
                this.handleClick();
            }
        });

        // 鼠标滚轮缩放
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.001;
            const zoomDelta = e.deltaY * zoomSpeed;

            // 限制缩放范围
            const minDistance = 3;
            const maxDistance = 20;
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);

            const newPosition = this.camera.position.clone();
            newPosition.add(direction.multiplyScalar(zoomDelta));

            const distance = newPosition.length();
            if (distance >= minDistance && distance <= maxDistance) {
                this.camera.position.copy(newPosition);
            }
        });

        // 阻止默认的滚动行为
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    handleClick() {
        // 实现点击选择对象的功能
        // 这里可以添加射线检测来选择3D对象
    }

    showLinkedList() {
        this.clearScene();
        this.currentStructure = 'linkedlist';

        const nodeCount = 6;
        const nodes = [];
        const nodeRadius = 0.3;
        const nodeSpacing = 2.0;

        // 创建链表节点
        for (let i = 0; i < nodeCount; i++) {
            const node = this.createLinkedListNode(i, nodeRadius);
            node.position.x = i * nodeSpacing - (nodeCount - 1) * nodeSpacing / 2;
            nodes.push(node);
            this.scene.add(node);
            this.meshes.set(`node_${i}`, node);

            // 创建节点标签
            const label = this.createNodeLabel(i.toString(), node.position);
            this.scene.add(label);
            this.labels.set(`label_${i}`, label);

            // 创建箭头（除了最后一个节点）
            if (i < nodeCount - 1) {
                const arrow = this.createArrow(
                    new THREE.Vector3(node.position.x + nodeRadius, 0, 0),
                    new THREE.Vector3(nodes[i + 1].position.x - nodeRadius, 0, 0)
                );
                this.scene.add(arrow);
                this.arrows.set(`arrow_${i}`, arrow);
            }
        }

        // 添加链表头指针
        const headPointer = this.createPointer('Head', nodes[0].position);
        this.scene.add(headPointer);
        this.meshes.set('head_pointer', headPointer);

        // 添加链表尾指针
        const tailPointer = this.createPointer('Tail', nodes[nodeCount - 1].position);
        this.scene.add(tailPointer);
        this.meshes.set('tail_pointer', tailPointer);

        this.animateLinkedList();
    }

    showBinaryTree() {
        this.clearScene();
        this.currentStructure = 'binarytree';

        // 二叉树节点位置
        const nodePositions = [
            { x: 0, y: 2, z: 0 },    // 根节点 0
            { x: -2, y: 1, z: 0 },   // 左子节点 1
            { x: 2, y: 1, z: 0 },    // 右子节点 2
            { x: -3, y: 0, z: 0 },   // 左左子节点 3
            { x: -1, y: 0, z: 0 },   // 左右子节点 4
            { x: 1, y: 0, z: 0 },    // 右左子节点 5
            { x: 3, y: 0, z: 0 }     // 右右子节点 6
        ];

        const nodes = [];
        const nodeRadius = 0.3;

        // 创建二叉树节点
        nodePositions.forEach((pos, index) => {
            const node = this.createTreeNode(index, nodeRadius);
            node.position.set(pos.x, pos.y, pos.z);
            nodes.push(node);
            this.scene.add(node);
            this.meshes.set(`tree_node_${index}`, node);

            // 创建节点标签
            const label = this.createNodeLabel(index.toString(), node.position);
            this.scene.add(label);
            this.labels.set(`tree_label_${index}`, label);
        });

        // 创建树连接
        const edges = [
            [0, 1], [0, 2],  // 根节点到左右子节点
            [1, 3], [1, 4],  // 左子节点到其子节点
            [2, 5], [2, 6]   // 右子节点到其子节点
        ];

        edges.forEach(([from, to], index) => {
            const arrow = this.createArrow(
                nodes[from].position.clone(),
                nodes[to].position.clone()
            );
            this.scene.add(arrow);
            this.arrows.set(`tree_arrow_${index}`, arrow);
        });

        this.animateBinaryTree();
    }

    showGraph() {
        this.clearScene();
        this.currentStructure = 'graph';

        const nodeCount = 8;
        const radius = 3;
        const nodes = [];
        const nodeRadius = 0.3;

        // 创建图节点（圆形布局）
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const node = this.createGraphNode(i, nodeRadius);
            node.position.set(x, y, 0);
            nodes.push(node);
            this.scene.add(node);
            this.meshes.set(`graph_node_${i}`, node);

            // 创建节点标签
            const label = this.createNodeLabel(i.toString(), node.position);
            this.scene.add(label);
            this.labels.set(`graph_label_${i}`, label);
        }

        // 创建随机边
        let edgeIndex = 0;
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                if (Math.random() > 0.6) { // 60%的概率创建边
                    const arrow = this.createArrow(
                        nodes[i].position.clone(),
                        nodes[j].position.clone(),
                        0x3498db
                    );
                    this.scene.add(arrow);
                    this.arrows.set(`graph_arrow_${edgeIndex}`, arrow);
                    edgeIndex++;
                }
            }
        }

        this.animateGraph();
    }

    createLinkedListNode(index, radius) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            shininess: 100
        });
        const node = new THREE.Mesh(geometry, material);
        node.castShadow = true;
        node.receiveShadow = true;

        // 添加数据区域
        const dataGeometry = new THREE.BoxGeometry(radius * 1.5, radius * 0.8, radius * 0.2);
        const dataMaterial = new THREE.MeshPhongMaterial({ color: 0x2ecc71 });
        const data = new THREE.Mesh(dataGeometry, dataMaterial);
        data.position.y = radius * 0.5;
        data.castShadow = true;
        node.add(data);

        // 添加指针区域
        const pointerGeometry = new THREE.BoxGeometry(radius * 1.2, radius * 0.6, radius * 0.2);
        const pointerMaterial = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
        const pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
        pointer.position.y = -radius * 0.5;
        pointer.castShadow = true;
        node.add(pointer);

        return node;
    }

    createTreeNode(index, radius) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x2ecc71,
            shininess: 100
        });
        const node = new THREE.Mesh(geometry, material);
        node.castShadow = true;
        node.receiveShadow = true;
        return node;
    }

    createGraphNode(index, radius) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xe74c3c,
            shininess: 100
        });
        const node = new THREE.Mesh(geometry, material);
        node.castShadow = true;
        node.receiveShadow = true;
        return node;
    }

    createNodeLabel(text, position) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;

        // 绘制背景
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制文字
        context.fillStyle = '#000000';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.position.y += 0.8;
        sprite.scale.set(1, 1, 1);

        return sprite;
    }

    createArrow(from, to, color = 0x34495e) {
        const direction = new THREE.Vector3().subVectors(to, from);
        const length = direction.length();
        direction.normalize();

        const arrowHelper = new THREE.ArrowHelper(
            direction,
            from,
            length,
            color,
            length * 0.2,
            length * 0.1
        );

        return arrowHelper;
    }

    createPointer(text, position) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;

        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#2c3e50';
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.position.y += 1.5;
        sprite.scale.set(2, 1, 1);

        return sprite;
    }

    animateLinkedList() {
        // 链表特定动画
        if (this.currentStructure !== 'linkedlist') return;

        // 可以添加链表遍历动画等
    }

    animateBinaryTree() {
        // 二叉树特定动画
        if (this.currentStructure !== 'binarytree') return;

        // 可以添加树遍历动画等
    }

    animateGraph() {
        // 图特定动画
        if (this.currentStructure !== 'graph') return;

        // 可以添加图遍历动画等
    }

    clearScene() {
        // 清理所有自定义对象
        this.meshes.forEach(mesh => {
            this.scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(m => m.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
        });

        this.labels.forEach(label => {
            this.scene.remove(label);
            if (label.material) label.material.dispose();
        });

        this.arrows.forEach(arrow => {
            this.scene.remove(arrow);
        });

        this.meshes.clear();
        this.labels.clear();
        this.arrows.clear();
    }

    resetCamera() {
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
    }

    onWindowResize() {
        const container = document.getElementById('3d-container');
        if (!container || !this.camera || !this.renderer) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // 更新场景
        this.updateScene();

        // 渲染
        this.renderer.render(this.scene, this.camera);
    }

    updateScene() {
        // 更新场景中的对象
        const time = Date.now() * 0.001;

        // 添加一些细微的动画效果
        this.meshes.forEach((mesh, key) => {
            if (key.startsWith('node_') || key.startsWith('tree_node_') || key.startsWith('graph_node_')) {
                mesh.rotation.y = time * 0.5;
            }
        });
    }

    // 获取当前显示的结构类型
    getCurrentStructure() {
        return this.currentStructure;
    }

    // 导出当前视图为图片
    exportScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = `aces-3d-${this.currentStructure}-${new Date().getTime()}.png`;
        link.href = dataURL;
        link.click();
    }

    // 清理资源
    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.clearScene();

        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }

        this.scene = null;
        this.camera = null;
        this.currentStructure = null;
        this.isInitialized = false;

        console.log('3D可视化模块清理完成');
    }
}