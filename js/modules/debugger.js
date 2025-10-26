import { Utils } from './utils.js';

export class DebuggerManager {
    constructor() {
        this.utils = new Utils();
        this.debugEditor = null;
        this.isInitialized = false;
        this.isDebugging = false;
        this.currentLine = 0;
        this.breakpoints = new Set();
        this.variables = new Map();
        this.callStack = [];

        // 示例调试代码
        this.debugCode = `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int num = 5;
    int result = factorial(num);
    cout << "阶乘结果: " << result << endl;
    return 0;
}`;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 动态加载CodeMirror（如果尚未加载）
            await this.loadCodeMirror();

            // 初始化调试器
            this.initializeDebugger();

            // 设置事件监听器
            this.setupEventListeners();

            // 初始化调试状态
            this.initializeDebugState();

            this.isInitialized = true;
            console.log('调试器模块初始化完成');

        } catch (error) {
            console.error('调试器模块初始化失败:', error);
            throw error;
        }
    }

    async loadCodeMirror() {
        if (window.CodeMirror) return;

        // 加载CSS
        await this.utils.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css');
        await this.utils.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css');

        // 加载JS
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js');
        await this.utils.loadJS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js');
    }

    initializeDebugger() {
        const textarea = document.getElementById('debug-code');
        if (!textarea) {
            throw new Error('调试代码区域未找到');
        }

        this.debugEditor = CodeMirror.fromTextArea(textarea, {
            mode: "text/x-c++src",
            theme: "monokai",
            lineNumbers: true,
            readOnly: true,
            matchBrackets: true,
            styleActiveLine: true
        });

        // 设置调试代码
        this.debugEditor.setValue(this.debugCode);

        // 添加断点点击事件
        this.debugEditor.on('gutterClick', (cm, line) => {
            this.toggleBreakpoint(line);
        });
    }

    setupEventListeners() {
        // 调试控制按钮
        document.addEventListener('click', (event) => {
            switch (event.target.id) {
                case 'step-over':
                    this.stepOver();
                    break;
                case 'step-into':
                    this.stepInto();
                    break;
                case 'continue-debug':
                    this.continueDebug();
                    break;
                case 'reset-debug':
                    this.resetDebug();
                    break;
                case 'add-breakpoint':
                    this.addBreakpointAtCurrentLine();
                    break;
                case 'clear-breakpoints':
                    this.clearBreakpoints();
                    break;
            }
        });
    }

    initializeDebugState() {
        this.currentLine = 0;
        this.breakpoints.clear();
        this.variables.clear();
        this.callStack = [];
        this.isDebugging = false;

        this.updateDebugView();
    }

    toggleBreakpoint(line) {
        if (this.breakpoints.has(line)) {
            this.breakpoints.delete(line);
            this.debugEditor.setGutterMarker(line, 'breakpoints', null);
        } else {
            this.breakpoints.add(line);
            const marker = document.createElement('div');
            marker.style.color = '#e74c3c';
            marker.innerHTML = '●';
            this.debugEditor.setGutterMarker(line, 'breakpoints', marker);
        }
    }

    addBreakpointAtCurrentLine() {
        if (this.currentLine >= 0) {
            this.toggleBreakpoint(this.currentLine);
        }
    }

    clearBreakpoints() {
        this.breakpoints.forEach(line => {
            this.debugEditor.setGutterMarker(line, 'breakpoints', null);
        });
        this.breakpoints.clear();
    }

    stepOver() {
        if (!this.isDebugging) {
            this.startDebugging();
            return;
        }

        this.currentLine++;

        // 检查是否到达断点
        if (this.breakpoints.has(this.currentLine)) {
            this.pauseAtBreakpoint();
            return;
        }

        // 检查是否到达函数结束
        if (this.currentLine >= this.getCodeLines().length) {
            this.finishDebugging();
            return;
        }

        this.updateDebugState();
        this.updateDebugView();
    }

    stepInto() {
        if (!this.isDebugging) {
            this.startDebugging();
            return;
        }

        const currentLineText = this.getCurrentLineText();

        // 检查是否是函数调用
        if (currentLineText.includes('factorial(')) {
            this.enterFunction();
        } else {
            this.stepOver();
        }
    }

    continueDebug() {
        if (!this.isDebugging) {
            this.startDebugging();
            return;
        }

        // 继续执行直到下一个断点或程序结束
        while (this.currentLine < this.getCodeLines().length - 1) {
            this.currentLine++;

            if (this.breakpoints.has(this.currentLine)) {
                this.pauseAtBreakpoint();
                return;
            }

            this.updateDebugState();
        }

        this.finishDebugging();
    }

    resetDebug() {
        this.initializeDebugState();
        this.debugEditor.setValue(this.debugCode);
        this.updateDebugView();
    }

    startDebugging() {
        this.isDebugging = true;
        this.currentLine = 0;
        this.updateDebugState();
        this.updateDebugView();

        this.showDebugMessage('调试会话开始', 'info');
    }

    pauseAtBreakpoint() {
        this.updateDebugState();
        this.updateDebugView();

        this.showDebugMessage(`在断点处暂停: 第${this.currentLine + 1}行`, 'warning');
    }

    finishDebugging() {
        this.isDebugging = false;
        this.updateDebugView();

        this.showDebugMessage('程序执行完成', 'success');
    }

    enterFunction() {
        // 模拟进入函数
        const functionName = 'factorial';
        this.callStack.push({
            function: functionName,
            line: this.currentLine,
            variables: new Map(this.variables)
        });

        // 更新变量状态
        this.updateFactorialVariables();

        this.currentLine = this.findFunctionStart(functionName);
        this.updateDebugView();
    }

    exitFunction() {
        if (this.callStack.length > 0) {
            const frame = this.callStack.pop();
            this.variables = frame.variables;
            this.currentLine = frame.line + 1;
        }

        this.updateDebugView();
    }

    findFunctionStart(functionName) {
        const lines = this.getCodeLines();
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(`int ${functionName}(`)) {
                return i;
            }
        }
        return 0;
    }

    updateDebugState() {
        const currentLineText = this.getCurrentLineText();

        // 更新变量状态
        this.updateVariables(currentLineText);

        // 更新调用栈
        this.updateCallStack();

        // 检查函数返回
        if (currentLineText.includes('return') && this.callStack.length > 0) {
            this.exitFunction();
        }
    }

    updateVariables(lineText) {
        // 解析变量赋值
        if (lineText.includes('int num =')) {
            this.variables.set('num', 5);
        } else if (lineText.includes('int result =')) {
            this.variables.set('result', this.calculateFactorial(5));
        } else if (lineText.includes('return n * factorial(n - 1)')) {
            const n = this.variables.get('n') || 5;
            this.variables.set('result', this.calculateFactorial(n));
        }
    }

    updateFactorialVariables() {
        // 设置阶乘函数的变量
        const callStackSize = this.callStack.length;
        const n = 5 - callStackSize + 1;
        this.variables.set('n', n);
    }

    updateCallStack() {
        const stackElement = document.getElementById('call-stack');
        if (!stackElement) return;

        let stackContent = '';
        this.callStack.forEach((frame, index) => {
            stackContent += `${frame.function} (第${frame.line + 1}行)\n`;
        });

        if (this.callStack.length === 0) {
            stackContent = 'main (当前)';
        } else {
            stackContent += 'main\n';
        }

        stackElement.textContent = stackContent;
    }

    updateDebugView() {
        if (!this.debugEditor) return;

        // 高亮当前行
        this.debugEditor.setSelection(
            { line: this.currentLine, ch: 0 },
            { line: this.currentLine, ch: 100 }
        );

        // 更新变量监视
        this.updateVariableWatch();

        // 更新调试状态
        this.updateDebugStatus();
    }

    updateVariableWatch() {
        const watchElement = document.getElementById('variable-watch');
        if (!watchElement) return;

        let watchContent = '';
        this.variables.forEach((value, name) => {
            watchContent += `${name} = ${value}\n`;
        });

        if (this.variables.size === 0) {
            watchContent = '暂无变量数据';
        }

        watchElement.textContent = watchContent;
    }

    updateDebugStatus() {
        const statusElement = document.getElementById('debug-status');
        if (!statusElement) return;

        let status = this.isDebugging ? '调试中' : '已停止';
        status += ` | 当前行: ${this.currentLine + 1}`;
        status += ` | 断点数: ${this.breakpoints.size}`;
        status += ` | 调用栈深度: ${this.callStack.length}`;

        statusElement.textContent = status;
    }

    getCodeLines() {
        return this.debugCode.split('\n');
    }

    getCurrentLineText() {
        const lines = this.getCodeLines();
        return this.currentLine < lines.length ? lines[this.currentLine] : '';
    }

    calculateFactorial(n) {
        if (n <= 1) return 1;
        return n * this.calculateFactorial(n - 1);
    }

    showDebugMessage(message, type = 'info') {
        // 在实际应用中，可以显示一个调试消息面板
        console.log(`[DEBUG ${type.toUpperCase()}] ${message}`);

        const outputElement = document.getElementById('debug-output');
        if (outputElement) {
            const timestamp = new Date().toLocaleTimeString();
            outputElement.textContent += `[${timestamp}] ${message}\n`;
            outputElement.scrollTop = outputElement.scrollHeight;
        }
    }

    // 设置自定义调试代码
    setDebugCode(code) {
        this.debugCode = code;
        if (this.debugEditor) {
            this.debugEditor.setValue(code);
        }
        this.resetDebug();
    }

    // 获取当前调试状态
    getDebugState() {
        return {
            isDebugging: this.isDebugging,
            currentLine: this.currentLine,
            breakpoints: Array.from(this.breakpoints),
            variables: Object.fromEntries(this.variables),
            callStack: this.callStack
        };
    }

    // 清理资源
    cleanup() {
        if (this.debugEditor) {
            const editorElement = this.debugEditor.getWrapperElement();
            if (editorElement && editorElement.parentNode) {
                editorElement.parentNode.removeChild(editorElement);
            }
            this.debugEditor = null;
        }

        this.breakpoints.clear();
        this.variables.clear();
        this.callStack = [];
        this.isDebugging = false;
        this.isInitialized = false;

        console.log('调试器模块清理完成');
    }
}