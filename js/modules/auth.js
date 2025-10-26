import { Utils } from './utils.js';

export class AuthManager {
    constructor() {
        this.utils = new Utils();
        this.currentUser = null;
        this.isInitialized = false;
        this.authModal = null;
    }

    async init() {
        // 检查现有的认证状态
        await this.checkAuthStatus();

        // 设置事件监听器
        this.setupEventListeners();

        // 创建认证模态框
        this.createAuthModals();

        this.isInitialized = true;
    }

    async checkAuthStatus() {
        try {
            const savedUser = localStorage.getItem('aces_current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.updateUIForLoggedInUser();
            }
        } catch (error) {
            console.error('检查认证状态失败:', error);
            this.clearAuthData();
        }
    }

    setupEventListeners() {
        // 登录按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'login-btn') {
                this.showLoginModal();
            }
        });

        // 注册按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'register-btn') {
                this.showRegisterModal();
            }
        });

        // 退出按钮
        document.addEventListener('click', (event) => {
            if (event.target.id === 'logout-btn') {
                this.logout();
            }
        });

        // 模态框关闭
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('close-modal') ||
                event.target.classList.contains('modal')) {
                this.hideAuthModals();
            }
        });

        // 切换登录/注册
        document.addEventListener('click', (event) => {
            if (event.target.id === 'show-register') {
                event.preventDefault();
                this.showRegisterModal();
            }
            if (event.target.id === 'show-login') {
                event.preventDefault();
                this.showLoginModal();
            }
        });

        // 表单提交
        document.addEventListener('submit', (event) => {
            if (event.target.id === 'login-form') {
                event.preventDefault();
                this.handleLogin(event.target);
            }
            if (event.target.id === 'register-form') {
                event.preventDefault();
                this.handleRegister(event.target);
            }
        });
    }

    createAuthModals() {
        const modalContainer = document.getElementById('auth-modals');
        if (!modalContainer) return;

        modalContainer.innerHTML = `
            <!-- 登录模态窗口 -->
            <div id="login-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>用户登录</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">邮箱:</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">密码:</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="remember-me"> 记住我
                            </label>
                        </div>
                        <button type="submit" class="debug-btn" style="width: 100%;">登录</button>
                    </form>
                    <p style="text-align: center; margin-top: 15px;">
                        还没有账号? <a href="#" id="show-register">立即注册</a>
                    </p>
                </div>
            </div>

            <!-- 注册模态窗口 -->
            <div id="register-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>用户注册</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="register-form">
                        <div class="form-group">
                            <label for="register-username">用户名:</label>
                            <input type="text" id="register-username" required>
                        </div>
                        <div class="form-group">
                            <label for="register-email">邮箱:</label>
                            <input type="email" id="register-email" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">密码:</label>
                            <input type="password" id="register-password" required>
                        </div>
                        <div class="form-group">
                            <label for="register-confirm-password">确认密码:</label>
                            <input type="password" id="register-confirm-password" required>
                        </div>
                        <button type="submit" class="debug-btn" style="width: 100%;">注册</button>
                    </form>
                    <p style="text-align: center; margin-top: 15px;">
                        已有账号? <a href="#" id="show-login">立即登录</a>
                    </p>
                </div>
            </div>
        `;
    }

    showLoginModal() {
        this.hideAuthModals();
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    showRegisterModal() {
        this.hideAuthModals();
        const modal = document.getElementById('register-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideAuthModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = this.utils.sanitizeInput(formData.get('email') || document.getElementById('login-email').value);
        const password = formData.get('password') || document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        try {
            // 模拟登录验证
            if (this.validateEmail(email) && password.length >= 6) {
                this.currentUser = {
                    username: email.split('@')[0],
                    email: email,
                    id: this.utils.generateId(),
                    loginTime: new Date().toISOString()
                };

                // 保存到localStorage
                if (rememberMe) {
                    localStorage.setItem('aces_current_user', JSON.stringify(this.currentUser));
                }

                this.hideAuthModals();
                this.updateUIForLoggedInUser();
                this.showNotification('登录成功!', 'success');

                // 触发登录事件
                this.triggerAuthEvent('login', this.currentUser);

            } else {
                throw new Error('邮箱或密码无效');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            console.error('登录失败:', error);
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const username = this.utils.sanitizeInput(formData.get('username') || document.getElementById('register-username').value);
        const email = this.utils.sanitizeInput(formData.get('email') || document.getElementById('register-email').value);
        const password = formData.get('password') || document.getElementById('register-password').value;
        const confirmPassword = formData.get('confirm-password') || document.getElementById('register-confirm-password').value;

        try {
            // 验证输入
            if (!this.validateEmail(email)) {
                throw new Error('请输入有效的邮箱地址');
            }
            if (password !== confirmPassword) {
                throw new Error('密码不匹配');
            }
            if (password.length < 6) {
                throw new Error('密码长度至少6位');
            }
            if (username.length < 2) {
                throw new Error('用户名长度至少2位');
            }

            // 模拟注册
            this.currentUser = {
                username: username,
                email: email,
                id: this.utils.generateId(),
                registerTime: new Date().toISOString()
            };

            // 保存用户数据
            localStorage.setItem('aces_current_user', JSON.stringify(this.currentUser));

            this.hideAuthModals();
            this.updateUIForLoggedInUser();
            this.showNotification('注册成功!', 'success');

            // 触发注册事件
            this.triggerAuthEvent('register', this.currentUser);

        } catch (error) {
            this.showNotification(error.message, 'error');
            console.error('注册失败:', error);
        }
    }

    logout() {
        this.currentUser = null;
        this.clearAuthData();
        this.updateUIForLoggedOutUser();
        this.showNotification('已退出登录', 'info');

        // 触发退出事件
        this.triggerAuthEvent('logout');
    }

    clearAuthData() {
        localStorage.removeItem('aces_current_user');
    }

    updateUIForLoggedInUser() {
        const authButtons = document.getElementById('auth-buttons');
        const userInfo = document.getElementById('user-info');
        const usernameDisplay = document.getElementById('username-display');
        const userAvatar = document.getElementById('user-avatar');

        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (usernameDisplay && this.currentUser) {
            usernameDisplay.textContent = this.currentUser.username;
        }
        if (userAvatar && this.currentUser) {
            userAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
    }

    updateUIForLoggedOutUser() {
        const authButtons = document.getElementById('auth-buttons');
        const userInfo = document.getElementById('user-info');

        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 自动消失
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // 点击关闭
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationColor(type) {
        const colors = {
            success: '#2ecc71',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || colors.info;
    }

    triggerAuthEvent(type, data = null) {
        const event = new CustomEvent(`auth-${type}`, {
            detail: data
        });
        window.dispatchEvent(event);
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否已认证
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // 清理资源
    cleanup() {
        this.hideAuthModals();
    }
}