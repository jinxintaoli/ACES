import { Utils } from './utils.js';

export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.utils = new Utils();
        this.isInitialized = false;
    }

    async init() {
        // 定义路由
        this.defineRoutes();

        // 监听路由变化
        this.setupEventListeners();

        // 处理初始路由
        await this.handleRouteChange();

        this.isInitialized = true;
    }

    defineRoutes() {
        // 主路由定义
        this.routes.set('/', {
            title: 'ACES - 仪表板',
            template: 'dashboard',
            module: 'flowchart'
        });

        this.routes.set('/cpp', {
            title: 'ACES - C++ 知识点',
            template: 'cpp-knowledge',
            module: 'code-editor'
        });

        this.routes.set('/algorithms', {
            title: 'ACES - 算法库',
            template: 'algorithms',
            module: 'code-editor'
        });

        this.routes.set('/editor', {
            title: 'ACES - 代码编辑器',
            template: 'code-editor',
            module: 'code-editor'
        });

        this.routes.set('/analysis', {
            title: 'ACES - 学习分析',
            template: 'analysis',
            module: 'analysis'
        });

        // 404 路由
        this.routes.set('404', {
            title: 'ACES - 页面未找到',
            template: '404',
            module: null
        });
    }

    // 在 Router 类中添加这个方法
updateContent(html) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = html;

        // 隐藏加载状态
        const loadingElement = document.querySelector('.loading-spinner');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // 触发页面初始化
        this.initializePage();
    }
}

// 同时添加 initializePage 方法
initializePage() {
    // 简单的页面初始化逻辑
    console.log('页面内容已更新，执行初始化...');

    // 如果是仪表板页面，设置事件监听器
    if (window.location.hash === '#/' || !window.location.hash) {
        this.setupDashboardEvents();
    }
}

setupDashboardEvents() {
    // 简化的仪表板事件设置
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
}

switchTab(tabId) {
    // 简化的标签页切换
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetContent = document.getElementById(`${tabId}-content`);
    const targetTab = document.querySelector(`.tab[data-tab="${tabId}"]`);

    if (targetContent) targetContent.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
}

    setupEventListeners() {
        // 监听浏览器前进后退
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // 拦截链接点击
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[data-route]');
            if (link) {
                event.preventDefault();
                const route = link.getAttribute('href');
                this.navigate(route);
            }
        });
    }

    async navigate(path, replace = false) {
        const fullPath = this.utils.sanitizePath(path);

        if (replace) {
            window.history.replaceState(null, '', fullPath);
        } else {
            window.history.pushState(null, '', fullPath);
        }

        await this.handleRouteChange();
    }

    async handleRouteChange() {
        const path = window.location.pathname;
        const route = this.routes.get(path) || this.routes.get('404');

        if (this.currentRoute === path) return;

        this.currentRoute = path;

        try {
            // 显示加载状态
            this.showLoading();

            // 更新页面标题
            document.title = route.title;

            // 加载模板
            const template = await this.loadTemplate(route.template);

            // 更新内容
            this.updateContent(template);

            // 加载模块
            if (route.module) {
                await this.loadModule(route.module);
            }

            // 隐藏加载状态
            this.hideLoading();

        } catch (error) {
            console.error('路由处理失败:', error);
            this.navigate('/404', true);
        }
    }

async loadTemplate(page) {
    // 设置超时时间（5秒）
    const TIMEOUT = 5000;

    return new Promise(async (resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`加载超时 (${TIMEOUT}ms)`));
        }, TIMEOUT);

        try {
            // 如果是404页面，直接返回内容
            if (page === '404') {
                clearTimeout(timeoutId);
                resolve(`
                    <div style="text-align: center; padding: 50px;">
                        <h2>页面未找到</h2>
                        <p>抱歉，您访问的页面不存在。</p>
                        <button onclick="ACES_APP.router.navigate('/')">返回首页</button>
                    </div>
                `);
                return;
            }

            const response = await fetch(`./pages/${page}.html`);
            if (!response.ok) throw new Error('模板加载失败');
            const html = await response.text();

            clearTimeout(timeoutId);
            resolve(html);
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn(`页面 ${page} 加载失败，使用备用内容:`, error);
            // 返回简化的备用内容
            resolve(this.getFallbackContent(page));
        }
    });
}

getFallbackContent(page) {
    const fallbacks = {
        'dashboard': `
            <div class="dashboard">
                <h2>ACES 仪表板</h2>
                <p>快速加载的简化版本</p>
                <div class="quick-actions">
                    <button onclick="ACES_APP.router.navigate('/code-editor')">代码编辑器</button>
                    <button onclick="ACES_APP.router.navigate('/algorithms')">算法学习</button>
                </div>
            </div>
        `,
        'cpp-knowledge': `
            <div class="card">
                <h3>C++ 知识库</h3>
                <p>基础内容加载中...</p>
            </div>
        `,
        'algorithms': `
            <div class="card">
                <h3>算法库</h3>
                <p>快速访问常用算法</p>
            </div>
        `
    };
    return fallbacks[page] || this.loadTemplate('404');
}

    async loadModule(moduleName) {
        try {
            const app = window.ACES_APP;
            if (app && app.loadModule) {
                const module = await app.loadModule(moduleName);
                if (module && module.init) {
                    await module.init();
                }
            }
        } catch (error) {
            console.error(`加载模块 ${moduleName} 失败:`, error);
        }
    }

    showLoading() {
        // 可以在这里显示加载指示器
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const existingLoader = mainContent.querySelector('.route-loading');
            if (!existingLoader) {
                const loader = document.createElement('div');
                loader.className = 'route-loading';
                loader.innerHTML = `
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>加载中...</p>
                    </div>
                `;
                mainContent.appendChild(loader);
            }
        }
    }

    hideLoading() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const loader = mainContent.querySelector('.route-loading');
            if (loader) {
                loader.remove();
            }
        }
    }

    // 获取当前路由信息
    getCurrentRoute() {
        return {
            path: this.currentRoute,
            config: this.routes.get(this.currentRoute)
        };
    }

    // 清理资源
    cleanup() {
        // 清理事件监听器
        window.removeEventListener('popstate', this.handleRouteChange);
    }
}