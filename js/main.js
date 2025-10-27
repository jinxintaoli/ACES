// 主应用入口文件
import { Router } from './modules/router.js';
import { AuthManager } from './modules/auth.js';
import { Utils } from './modules/utils.js';

// 防止重复声明
// 防止重复声明 - 使用条件检查而不是返回
if (window.ACES_APP_LOADED) {
    console.warn('ACES 应用已加载，跳过重复初始化');
    // 不要使用 return，改为空操作
} else {
    window.ACES_APP_LOADED = true;

    console.log('ACES 应用开始加载...', new Date().toISOString());

    // 简化的应用类
    class ACESApp {
        constructor() {
            this.init();
        }

        async init() {
            try {
                console.log('初始化路由系统...');

                // 直接加载仪表板，跳过复杂的路由
                await this.loadDashboard();

                console.log('ACES 应用初始化完成');
            } catch (error) {
                console.error('初始化失败:', error);
                this.showErrorState(error.message);
            }
        }

        async loadDashboard() {
            const mainContent = document.getElementById('main-content');
            const loadingSpinner = document.querySelector('.loading-spinner');

            if (!mainContent) {
                console.error('找不到 main-content 元素');
                return;
            }

            try {
                const response = await fetch('./pages/dashboard.html');
                if (!response.ok) throw new Error('无法加载仪表板');
                const html = await response.text();

                mainContent.innerHTML = html;
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'none';
                }
            } catch (error) {
                console.error('加载仪表板失败:', error);
                // 显示基础内容
                mainContent.innerHTML = this.getBasicContent();
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'none';
                }
            }
        }

        getBasicContent() {
            return `
                <div style="padding: 20px;">
                    <h2>ACES 平台</h2>
                    <p>欢迎使用信息学竞赛万能引擎</p>
                    <div style="margin-top: 20px;">
                        <button onclick="showSection('editor')" style="padding: 10px; margin: 5px;">代码编辑器</button>
                        <button onclick="showSection('algorithms')" style="padding: 10px; margin: 5px;">算法库</button>
                        <button onclick="showSection('cpp')" style="padding: 10px; margin: 5px;">C++ 知识</button>
                    </div>
                </div>
            `;
        }

        showErrorState(message) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div style="padding: 50px; text-align: center;">
                        <h3>应用加载遇到问题</h3>
                        <p>${message}</p>
                        <button onclick="location.reload()" style="padding: 10px 20px; margin: 5px;">重新加载</button>
                    </div>
                `;
            }
        }
    }

    // 启动应用
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM 加载完成，启动 ACES 应用');
        window.ACES_APP = new ACESApp();
    });

    // 简单的导航功能
    window.showSection = function(section) {
        alert('导航到: ' + section);
        // 这里可以添加实际的导航逻辑
    };
}

// 基础模式加载（应急方案）
window.loadBasicDashboard = function() {
    console.log('加载基础仪表板...');
    fetch('./pages/dashboard.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            const loadingElement = document.querySelector('.loading-spinner');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        })
        .catch(() => {
            document.getElementById('main-content').innerHTML = `
                <div style="padding: 20px;">
                    <h2>ACES 平台</h2>
                    <p>简化版本已加载</p>
                    <div>
                        <button onclick="alert('代码编辑器')">代码编辑器</button>
                        <button onclick="alert('算法库')">算法库</button>
                    </div>
                </div>
            `;
            const loadingElement = document.querySelector('.loading-spinner');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        });
};

// 修改 router.js 使其在全局可用
// 在 router.js 的末尾添加：window.ROUTER_MODULE = { Router };

// 启动应用（确保只启动一次）
if (!window.ACES_APP) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM 加载完成，启动 ACES 应用');
        window.ACES_APP = new ACESApp();
    });
} else {
    console.log('ACES 应用已存在，跳过初始化');
}

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