// 主应用入口文件
import { Router } from './modules/router.js';
import { AuthManager } from './modules/auth.js';
import { Utils } from './modules/utils.js';

class ACESApp {
    constructor() {
        this.router = new Router();
        this.authManager = new AuthManager();
        this.utils = new Utils();
        this.modules = new Map();
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            // 显示加载状态
            this.showLoadingState();

            // 初始化工具类
            await this.utils.init();

            // 初始化认证系统
            await this.authManager.init();

            // 初始化路由
            await this.router.init();

            // 预加载关键模块
            await this.preloadCriticalModules();

            // 隐藏加载状态
            this.hideLoadingState();

            this.isInitialized = true;

            console.log('ACES 应用初始化完成');

        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showErrorState('应用初始化失败，请刷新页面重试');
        }
    }

    showLoadingState() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>ACES 系统加载中...</p>
                </div>
            `;
        }
    }

    hideLoadingState() {
        // 路由会处理内容显示
    }

    showErrorState(message) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>加载失败</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="debug-btn">重新加载</button>
                </div>
            `;
        }
    }

    async preloadCriticalModules() {
        // 预加载关键模块
        const criticalModules = [
            './modules/code-editor.js',
            './modules/flowchart.js'
        ];

        await Promise.allSettled(
            criticalModules.map(module => import(module))
        );
    }

    // 动态加载模块
    async loadModule(moduleName) {
        if (this.modules.has(moduleName)) {
            return this.modules.get(moduleName);
        }

        try {
            const modulePath = `./modules/${moduleName}.js`;
            const module = await import(modulePath);
            this.modules.set(moduleName, module);
            return module;
        } catch (error) {
            console.error(`加载模块 ${moduleName} 失败:`, error);
            throw error;
        }
    }

    // 清理资源
    cleanup() {
        this.modules.forEach((module, name) => {
            if (module.cleanup) {
                module.cleanup();
            }
        });
        this.modules.clear();
    }
}

// 添加应用加载状态
window.APP_LOAD_START = Date.now();

class ACESApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // 并行初始化关键模块
            await Promise.all([
                this.initRouter(),
                this.initAuth(),
                this.preloadCriticalResources()
            ].map(p => p.catch(e => {
                console.warn('模块初始化警告:', e);
                return null; // 即使某个模块失败也不阻塞其他模块
            })));

            console.log(`ACES 应用初始化完成 (${Date.now() - window.APP_LOAD_START}ms)`);
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showErrorState(error);
        }
    }

    async initRouter() {
        const { Router } = await import('./modules/router.js');
        this.router = new Router();
        await this.router.init();
    }

    async initAuth() {
        // 延迟加载认证模块
        const { AuthManager } = await import('./modules/auth.js');
        this.auth = new AuthManager();
        // 非关键功能，不阻塞主流程
        setTimeout(() => this.auth.init(), 1000);
    }

    async preloadCriticalResources() {
        // 预加载关键资源
        const criticalPages = ['dashboard', 'cpp-knowledge', 'algorithms'];
        criticalPages.forEach(page => {
            fetch(`./pages/${page}.html`).catch(() => {}); // 静默失败
        });
    }

    showErrorState(error) {
        const content = document.getElementById('main-content');
        if (content) {
            content.innerHTML = `
                <div class="error-state">
                    <h3>应用加载异常</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()">重新加载</button>
                </div>
            `;
        }
    }
}

// 延迟非关键资源的加载
function loadNonCriticalResources() {
    // 延迟加载复杂模块
    setTimeout(() => {
        import('./modules/flowchart.js').catch(() => {});
        import('./modules/visualization3d.js').catch(() => {});
    }, 3000);
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.ACES_APP = new ACESApp();
    loadNonCriticalResources();
});

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});

// 应用启动
document.addEventListener('DOMContentLoaded', () => {
    // 防止重复初始化
    if (!window.ACES_APP) {
        window.ACES_APP = new ACESApp();
    }
});

// 应用清理
window.addEventListener('beforeunload', () => {
    if (window.ACES_APP) {
        window.ACES_APP.cleanup();
    }
});

// 导出应用实例
export default window.ACES_APP;