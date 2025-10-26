// ACES 系统常量配置
export const ACES_CONSTANTS = {
    // 系统信息
    SYSTEM: {
        NAME: "ACES 系统 (信息学竞赛万能引擎)",
        VERSION: "1.0.0",
        AUTHOR: "ACES 开发团队",
        DESCRIPTION: "信息学竞赛万能引擎 - 算法扩展、C++知识点与调试工具"
    },

    // API 端点
    API_ENDPOINTS: {
        COMPILE: "/api/compile",
        EXECUTE: "/api/execute",
        ANALYZE: "/api/analyze",
        DEBUG: "/api/debug",
        AUTH: "/api/auth"
    },

    // 编译器配置
    COMPILER: {
        STANDARDS: ["c++11", "c++14", "c++17", "c++20"],
        OPTIMIZATION_LEVELS: ["O0", "O1", "O2", "O3", "Os"],
        WARNING_LEVELS: ["none", "wall", "wextra", "pedantic"],
        DEBUG_LEVELS: ["g", "g0", "g1", "g2", "g3"]
    },

    // 算法分类
    ALGORITHM_CATEGORIES: {
        SORTING: "排序算法",
        SEARCHING: "搜索算法",
        GRAPH: "图算法",
        DYNAMIC_PROGRAMMING: "动态规划",
        GREEDY: "贪心算法",
        BACKTRACKING: "回溯算法",
        DIVIDE_CONQUER: "分治算法",
        STRING: "字符串算法",
        MATH: "数学算法",
        GEOMETRY: "几何算法"
    },

    // 复杂度级别
    COMPLEXITY_LEVELS: {
        CONSTANT: { name: "O(1)", color: "#2ecc71", description: "常数时间" },
        LOGARITHMIC: { name: "O(log n)", color: "#3498db", description: "对数时间" },
        LINEAR: { name: "O(n)", color: "#9b59b6", description: "线性时间" },
        LINEARITHMIC: { name: "O(n log n)", color: "#f39c12", description: "线性对数时间" },
        QUADRATIC: { name: "O(n²)", color: "#e74c3c", description: "平方时间" },
        EXPONENTIAL: { name: "O(2ⁿ)", color: "#34495e", description: "指数时间" },
        FACTORIAL: { name: "O(n!)", color: "#8e44ad", description: "阶乘时间" }
    },

    // 调试状态
    DEBUG_STATES: {
        IDLE: "idle",
        RUNNING: "running",
        PAUSED: "paused",
        FINISHED: "finished",
        ERROR: "error"
    },

    // 可视化类型
    VISUALIZATION_TYPES: {
        FLOWCHART: "flowchart",
        MEMORY: "memory",
        COMPLEXITY: "complexity",
        THREE_D: "3d",
        MINDMAP: "mindmap"
    },

    // 学习进度级别
    LEARNING_LEVELS: {
        BEGINNER: { min: 0, max: 30, name: "初级", color: "#e74c3c" },
        INTERMEDIATE: { min: 31, max: 70, name: "中级", color: "#f39c12" },
        ADVANCED: { min: 71, max: 90, name: "高级", color: "#3498db" },
        EXPERT: { min: 91, max: 100, name: "专家", color: "#2ecc71" }
    },

    // 题目难度
    PROBLEM_DIFFICULTY: {
        EASY: { name: "简单", color: "#2ecc71", points: 10 },
        MEDIUM: { name: "中等", color: "#f39c12", points: 20 },
        HARD: { name: "困难", color: "#e74c3c", points: 30 },
        EXPERT: { name: "专家", color: "#8e44ad", points: 50 }
    },

    // 错误类型
    ERROR_TYPES: {
        SYNTAX_ERROR: "语法错误",
        RUNTIME_ERROR: "运行时错误",
        LOGIC_ERROR: "逻辑错误",
        COMPILATION_ERROR: "编译错误",
        MEMORY_ERROR: "内存错误",
        TIMEOUT_ERROR: "超时错误"
    },

    // 主题配置
    THEMES: {
        LIGHT: {
            primary: "#2c3e50",
            secondary: "#3498db",
            background: "#ffffff",
            text: "#2c3e50",
            accent: "#e74c3c"
        },
        DARK: {
            primary: "#ecf0f1",
            secondary: "#3498db",
            background: "#2c3e50",
            text: "#ecf0f1",
            accent: "#e74c3c"
        },
        BLUE: {
            primary: "#ffffff",
            secondary: "#2980b9",
            background: "#3498db",
            text: "#ffffff",
            accent: "#e74c3c"
        }
    },

    // 本地存储键名
    STORAGE_KEYS: {
        USER_DATA: "aces_user_data",
        LEARNING_PROGRESS: "aces_learning_progress",
        CODE_HISTORY: "aces_code_history",
        SETTINGS: "aces_settings",
        AUTH_TOKEN: "aces_auth_token"
    },

    // 默认配置
    DEFAULTS: {
        CODE_TEMPLATE: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, ACES System!" << endl;
    return 0;
}`,
        EDITOR_THEME: "monokai",
        FONT_SIZE: 14,
        TAB_SIZE: 4,
        AUTO_SAVE: true,
        AUTO_COMPLETE: true
    },

    // 动画配置
    ANIMATION: {
        DURATION: {
            SHORT: 300,
            MEDIUM: 500,
            LONG: 1000
        },
        EASING: {
            EASE: "ease",
            EASE_IN: "ease-in",
            EASE_OUT: "ease-out",
            EASE_IN_OUT: "ease-in-out"
        }
    },

    // 响应式断点
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 992,
        DESKTOP: 1200,
        LARGE_DESKTOP: 1400
    }
};

// 导出默认常量
export default ACES_CONSTANTS;