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

    async loadTemplate(templateName) {
        try {
            const response = await fetch(`/pages/${templateName}.html`);
            if (!response.ok) throw new Error('模板加载失败');

            return await response.text();
        } catch (error) {
            console.error(`加载模板 ${templateName} 失败:`, error);
            // 返回默认错误模板
            return `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>页面加载失败</h3>
                    <p>无法加载请求的页面，请稍后重试。</p>
                    <button onclick="ACES_APP.router.navigate('/')" class="debug-btn">返回首页</button>
                </div>
            `;
        }
    }

    updateContent(html) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            // 使用安全的HTML插入
            this.utils.setSafeHTML(mainContent, html);
        }
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