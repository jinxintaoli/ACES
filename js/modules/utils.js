export class Utils {
    constructor() {
        this.initialized = false;
    }

    async init() {
        // 初始化工具类
        this.initialized = true;
    }

    // 安全的HTML插入
    setSafeHTML(element, html) {
        if (!element || !html) return;

        // 创建临时容器
        const temp = document.createElement('div');
        temp.innerHTML = this.sanitizeHTML(html);

        // 清空目标元素
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        // 插入新内容
        while (temp.firstChild) {
            element.appendChild(temp.firstChild);
        }
    }

    // HTML清理
    sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    // 输入清理
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';

        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }

    // 路径清理
    sanitizePath(path) {
        if (!path || typeof path !== 'string') return '/';

        // 确保路径以/开头
        let cleanPath = path.startsWith('/') ? path : '/' + path;

        // 移除多个连续的/
        cleanPath = cleanPath.replace(/\/+/g, '/');

        // 确保不是空路径
        if (cleanPath === '') cleanPath = '/';

        return cleanPath;
    }

    // 生成唯一ID
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    // 防抖函数
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 深度克隆
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const clonedObj = {};
            Object.keys(obj).forEach(key => {
                clonedObj[key] = this.deepClone(obj[key]);
            });
            return clonedObj;
        }
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 格式化时间
    formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    // 验证邮箱
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 验证URL
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // 加载CSS
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // 加载JS
    loadJS(src, isModule = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            if (isModule) {
                script.type = 'module';
            }
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 检查元素是否在视口中
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 复制到剪贴板
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // 回退方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (error) {
            console.error('复制到剪贴板失败:', error);
            return false;
        }
    }

    // 获取查询参数
    getQueryParams(url = window.location.search) {
        const params = new URLSearchParams(url);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    // 设置查询参数
    setQueryParams(params, url = window.location.href) {
        const urlObj = new URL(url);
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === undefined) {
                urlObj.searchParams.delete(key);
            } else {
                urlObj.searchParams.set(key, params[key]);
            }
        });
        return urlObj.toString();
    }

    // 性能测量
    measurePerformance(fn, ...args) {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        return {
            result,
            duration: end - start
        };
    }

    // 清理资源
    cleanup() {
        this.initialized = false;
    }
}