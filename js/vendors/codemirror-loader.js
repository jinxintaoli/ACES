/**
 * CodeMirror 动态加载器
 * 负责按需加载 CodeMirror 编辑器及其插件
 */

class CodeMirrorLoader {
    constructor() {
        this.isLoaded = false;
        this.isLoading = false;
        this.callbacks = [];
        this.loadedPlugins = new Set();
    }

    /**
     * 加载 CodeMirror 核心库
     */
    async loadCore() {
        if (this.isLoaded) return Promise.resolve();
        if (this.isLoading) return new Promise(resolve => this.callbacks.push(resolve));

        this.isLoading = true;

        try {
            // 加载 CSS
            await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css');

            // 加载主题
            await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css');
            await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/eclipse.min.css');
            await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/material.min.css');

            // 加载 JS
            await this.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js');

            this.isLoaded = true;
            this.isLoading = false;

            // 执行所有等待的回调
            this.callbacks.forEach(callback => callback());
            this.callbacks = [];

            console.log('CodeMirror 核心库加载完成');
            return true;
        } catch (error) {
            this.isLoading = false;
            console.error('CodeMirror 核心库加载失败:', error);
            throw error;
        }
    }

    /**
     * 加载语言模式
     * @param {string} mode - 语言模式
     */
    async loadMode(mode) {
        await this.loadCore();

        const modeMap = {
            'cpp': 'clike',
            'c': 'clike',
            'java': 'clike',
            'csharp': 'clike',
            'python': 'python',
            'javascript': 'javascript',
            'markdown': 'markdown',
            'html': 'htmlmixed',
            'css': 'css',
            'sql': 'sql'
        };

        const modeName = modeMap[mode] || mode;

        if (this.loadedPlugins.has(`mode-${modeName}`)) {
            return;
        }

        try {
            await this.loadJS(`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/${modeName}/${modeName}.min.js`);
            this.loadedPlugins.add(`mode-${modeName}`);
            console.log(`CodeMirror ${mode} 模式加载完成`);
        } catch (error) {
            console.error(`CodeMirror ${mode} 模式加载失败:`, error);
            throw error;
        }
    }

    /**
     * 加载插件
     * @param {string} plugin - 插件名称
     */
    async loadPlugin(plugin) {
        await this.loadCore();

        const pluginConfig = {
            'matchbrackets': {
                js: 'addon/edit/matchbrackets.min.js'
            },
            'active-line': {
                js: 'addon/selection/active-line.min.js'
            },
            'closebrackets': {
                js: 'addon/edit/closebrackets.min.js'
            },
            'comment': {
                js: 'addon/comment/comment.min.js'
            },
            'foldcode': {
                js: 'addon/fold/foldcode.min.js',
                css: 'addon/fold/foldgutter.css'
            },
            'foldgutter': {
                js: 'addon/fold/foldgutter.min.js'
            },
            'lint': {
                js: 'addon/lint/lint.min.js',
                css: 'addon/lint/lint.css'
            },
            'hint': {
                js: 'addon/hint/show-hint.min.js',
                css: 'addon/hint/show-hint.css'
            },
            'hint-anyword': {
                js: 'addon/hint/anyword-hint.min.js'
            },
            'hint-cpp': {
                js: 'addon/hint/cpp-hint.min.js'
            }
        };

        if (!pluginConfig[plugin]) {
            throw new Error(`未知的 CodeMirror 插件: ${plugin}`);
        }

        if (this.loadedPlugins.has(plugin)) {
            return;
        }

        try {
            const config = pluginConfig[plugin];

            if (config.css) {
                await this.loadCSS(`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/${config.css}`);
            }

            if (config.js) {
                await this.loadJS(`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/${config.js}`);
            }

            this.loadedPlugins.add(plugin);
            console.log(`CodeMirror 插件 ${plugin} 加载完成`);
        } catch (error) {
            console.error(`CodeMirror 插件 ${plugin} 加载失败:`, error);
            throw error;
        }
    }

    /**
     * 加载多个插件
     * @param {string[]} plugins - 插件列表
     */
    async loadPlugins(plugins) {
        for (const plugin of plugins) {
            await this.loadPlugin(plugin);
        }
    }

    /**
     * 创建编辑器实例
     * @param {HTMLElement} textarea - 文本区域元素
     * @param {Object} options - 编辑器选项
     */
    async createEditor(textarea, options = {}) {
        await this.loadCore();

        // 加载必要的模式和插件
        const mode = options.mode || 'cpp';
        await this.loadMode(mode);

        const defaultPlugins = ['matchbrackets', 'active-line'];
        await this.loadPlugins(defaultPlugins);

        // 合并默认选项
        const defaultOptions = {
            mode: mode === 'cpp' ? 'text/x-c++src' : mode,
            theme: 'monokai',
            lineNumbers: true,
            matchBrackets: true,
            styleActiveLine: true,
            indentUnit: 4,
            lineWrapping: true,
            autoCloseBrackets: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-/": "toggleComment",
                "Tab": "indentMore"
            }
        };

        const editorOptions = { ...defaultOptions, ...options };

        return CodeMirror.fromTextArea(textarea, editorOptions);
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
     * 获取可用主题列表
     */
    getAvailableThemes() {
        return [
            'monokai', 'eclipse', 'material', 'ambiance', 'base16-dark',
            'base16-light', 'blackboard', 'cobalt', 'elegant', 'erlang-dark',
            'lesser-dark', 'midnight', 'neat', 'night', 'paraiso-dark',
            'paraiso-light', 'rubyblue', 'solarized', 'the-matrix', 'tomorrow-night-eighties',
            'twilight', 'vibrant-ink', 'xq-dark', 'xq-light'
        ];
    }

    /**
     * 获取可用模式列表
     */
    getAvailableModes() {
        return {
            'cpp': 'C++',
            'c': 'C',
            'java': 'Java',
            'python': 'Python',
            'javascript': 'JavaScript',
            'markdown': 'Markdown',
            'html': 'HTML',
            'css': 'CSS',
            'sql': 'SQL'
        };
    }

    /**
     * 清理资源
     */
    cleanup() {
        this.isLoaded = false;
        this.isLoading = false;
        this.loadedPlugins.clear();
        this.callbacks = [];
    }
}

// 创建全局实例
window.CodeMirrorLoader = new CodeMirrorLoader();

export default CodeMirrorLoader;