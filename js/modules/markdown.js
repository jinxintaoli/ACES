import { Utils } from './utils.js';

export class MarkdownManager {
    constructor() {
        this.utils = new Utils();
        this.isInitialized = false;
        this.converter = null;
        this.currentNote = null;
        this.notes = [];
        this.editor = null;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // 初始化Showdown转换器
            this.converter = new showdown.Converter({
                tables: true,
                tasklists: true,
                strikethrough: true,
                simplifiedAutoLink: true,
                openLinksInNewWindow: true,
                emoji: true
            });

            // 设置事件监听器
            this.setupEventListeners();

            // 初始化编辑器
            this.initializeEditor();

            // 加载保存的笔记
            this.loadNotes();

            this.isInitialized = true;
            console.log('Markdown模块初始化完成');

        } catch (error) {
            console.error('Markdown模块初始化失败:', error);
            throw error;
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (event) => {
            switch (event.target.id) {
                case 'preview-markdown':
                    this.previewMarkdown();
                    break;
                case 'save-markdown':
                    this.saveNote();
                    break;
                case 'new-markdown':
                    this.newNote();
                    break;
                case 'export-markdown':
                    this.exportNote();
                    break;
                case 'import-markdown':
                    document.getElementById('import-markdown-file').click();
                    break;
                case 'clear-markdown':
                    this.clearEditor();
                    break;
                case 'format-bold':
                    this.formatText('**', '**');
                    break;
                case 'format-italic':
                    this.formatText('*', '*');
                    break;
                case 'format-code':
                    this.formatText('`', '`');
                    break;
                case 'format-link':
                    this.insertLink();
                    break;
                case 'format-image':
                    this.insertImage();
                    break;
            }
        });

        // 导入文件处理
        document.addEventListener('change', (event) => {
            if (event.target.id === 'import-markdown-file') {
                this.importNote(event.target.files[0]);
            }
        });

        // 笔记列表点击事件
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('note-item')) {
                const noteId = event.target.dataset.id;
                this.loadNote(noteId);
            }
        });

        // 自动保存（防抖）
        const markdownEditor = document.getElementById('markdown-editor');
        if (markdownEditor) {
            markdownEditor.addEventListener('input', this.utils.debounce(() => {
                this.autoSave();
            }, 2000));
        }
    }

    initializeEditor() {
        const textarea = document.getElementById('markdown-editor');
        if (!textarea) return;

        // 设置默认内容
        if (!textarea.value.trim()) {
            textarea.value = `# 我的学习笔记

## 今日学习内容
- [ ] 完成算法练习
- [x] 学习动态规划
- [ ] 复习C++知识点

## 重点总结
### 算法要点
1. **动态规划**的核心思想
2. 状态转移方程的建立
3. 空间复杂度优化

### 代码示例
\`\`\`cpp
class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        vector<int> dp(n + 1);
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
};
\`\`\`

## 学习资源
[ACES系统文档](https://aces-system.com)
![学习进度](https://via.placeholder.com/400x200?text=Progress+Chart)

| 项目 | 进度 | 状态 |
|------|------|------|
| 算法学习 | 75% | 🔄 |
| C++基础 | 90% | ✅ |
| 项目实践 | 50% | 🔄 |
`;
        }

        this.previewMarkdown();
    }

    previewMarkdown() {
        const editor = document.getElementById('markdown-editor');
        const preview = document.getElementById('markdown-preview');

        if (!editor || !preview) return;

        const markdownText = editor.value;
        const html = this.converter.makeHtml(markdownText);

        // 添加自定义样式
        const styledHtml = `
            <div class="markdown-body">
                ${html}
            </div>
        `;

        this.utils.setSafeHTML(preview, styledHtml);

        // 高亮代码块
        this.highlightCodeBlocks();
    }

    highlightCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.markdown-body pre code');
        codeBlocks.forEach(block => {
            const language = this.detectLanguage(block.textContent);
            block.className = `language-${language}`;

            // 简单的代码高亮
            const code = block.textContent;
            const highlighted = this.highlightSyntax(code, language);
            block.innerHTML = highlighted;
        });
    }

    detectLanguage(code) {
        if (code.includes('#include') || code.includes('using namespace')) {
            return 'cpp';
        } else if (code.includes('function') || code.includes('var ')) {
            return 'javascript';
        } else if (code.includes('def ') || code.includes('import ')) {
            return 'python';
        }
        return 'text';
    }

    highlightSyntax(code, language) {
        // 简单的语法高亮实现
        let highlighted = this.utils.sanitizeHTML(code);

        // C++ 关键字高亮
        if (language === 'cpp') {
            const keywords = ['class', 'public', 'private', 'protected', 'void', 'int', 'float', 'double', 'bool', 'return', 'if', 'else', 'for', 'while', 'include', 'using', 'namespace', 'vector', 'string'];
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span class="code-keyword">${keyword}</span>`);
            });

            // 字符串高亮
            highlighted = highlighted.replace(/("([^"]*)")/g, '<span class="code-string">$1</span>');

            // 注释高亮
            highlighted = highlighted.replace(/\/\/(.*)$/gm, '<span class="code-comment">//$1</span>');
            highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span class="code-comment">/*$1*/</span>');

            // 数字高亮
            highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
        }

        return highlighted;
    }

    newNote() {
        this.currentNote = null;
        const editor = document.getElementById('markdown-editor');
        if (editor) {
            editor.value = `# 新笔记

创建时间: ${new Date().toLocaleString()}

## 内容概要

开始编写您的笔记...`;
        }
        this.previewMarkdown();
        this.showMessage('已创建新笔记', 'info');
    }

    saveNote() {
        const editor = document.getElementById('markdown-editor');
        if (!editor) return;

        const content = editor.value;
        const title = this.extractTitle(content) || '未命名笔记';
        const excerpt = this.extractExcerpt(content);

        if (this.currentNote) {
            // 更新现有笔记
            this.currentNote.content = content;
            this.currentNote.title = title;
            this.currentNote.excerpt = excerpt;
            this.currentNote.updatedAt = new Date().toISOString();
            this.showMessage('笔记已更新', 'success');
        } else {
            // 创建新笔记
            const newNote = {
                id: this.utils.generateId(),
                title: title,
                excerpt: excerpt,
                content: content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: this.extractTags(content),
                wordCount: this.countWords(content)
            };
            this.notes.unshift(newNote);
            this.currentNote = newNote;
            this.showMessage('笔记已保存', 'success');
        }

        this.saveNotes();
        this.updateNotesList();
    }

    autoSave() {
        if (!this.currentNote) return;

        const editor = document.getElementById('markdown-editor');
        if (!editor) return;

        const content = editor.value;
        this.currentNote.content = content;
        this.currentNote.updatedAt = new Date().toISOString();
        this.currentNote.wordCount = this.countWords(content);

        this.saveNotes();
        this.updateNoteInList(this.currentNote);
    }

    loadNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.currentNote = note;
        const editor = document.getElementById('markdown-editor');
        if (editor) {
            editor.value = note.content;
        }
        this.previewMarkdown();
        this.showMessage(`已加载笔记: ${note.title}`, 'info');
    }

    deleteNote(noteId) {
        if (!confirm('确定要删除这个笔记吗？此操作不可恢复。')) return;

        this.notes = this.notes.filter(n => n.id !== noteId);
        if (this.currentNote && this.currentNote.id === noteId) {
            this.currentNote = null;
            this.newNote();
        }
        this.saveNotes();
        this.updateNotesList();
        this.showMessage('笔记已删除', 'warning');
    }

    exportNote() {
        if (!this.currentNote) {
            this.showMessage('没有可导出的笔记', 'warning');
            return;
        }

        const content = this.currentNote.content;
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `${this.currentNote.title}.md`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
        this.showMessage('笔记已导出', 'success');
    }

    importNote(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const editor = document.getElementById('markdown-editor');
            if (editor) {
                editor.value = content;
            }
            this.currentNote = null;
            this.previewMarkdown();
            this.showMessage('笔记已导入', 'success');
        };
        reader.onerror = () => {
            this.showMessage('文件读取失败', 'error');
        };
        reader.readAsText(file);
    }

    clearEditor() {
        if (!confirm('确定要清空编辑器吗？未保存的内容将丢失。')) return;

        const editor = document.getElementById('markdown-editor');
        if (editor) {
            editor.value = '';
        }
        this.previewMarkdown();
        this.currentNote = null;
    }

    formatText(before, after) {
        const editor = document.getElementById('markdown-editor');
        if (!editor) return;

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);
        const newText = before + selectedText + after;

        editor.setRangeText(newText);
        editor.focus();
        editor.setSelectionRange(start + before.length, end + before.length);

        this.previewMarkdown();
    }

    insertLink() {
        const url = prompt('请输入链接URL:');
        const text = prompt('请输入链接文本:', '链接描述');

        if (url && text) {
            this.formatText(`[${text}](`, `${url})`);
        }
    }

    insertImage() {
        const url = prompt('请输入图片URL:');
        const alt = prompt('请输入图片描述:', '图片描述');

        if (url && alt) {
            this.formatText(`![${alt}](`, `${url})`);
        }
    }

    extractTitle(content) {
        // 从内容中提取标题（第一个一级标题）
        const match = content.match(/^#\s+(.+)$/m);
        return match ? match[1].trim() : null;
    }

    extractExcerpt(content) {
        // 提取前100个字符作为摘要
        const plainText = content.replace(/[#*`\[\]]/g, '').trim();
        return plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
    }

    extractTags(content) {
        // 从内容中提取标签（以#开头的单词）
        const tagMatches = content.match(/#(\w+)/g);
        return tagMatches ? [...new Set(tagMatches.map(tag => tag.substring(1)))] : [];
    }

    countWords(content) {
        const plainText = content.replace(/[#*`\[\]()]/g, '').replace(/\s+/g, ' ');
        return plainText.trim().split(' ').filter(word => word.length > 0).length;
    }

    saveNotes() {
        try {
            localStorage.setItem('aces_markdown_notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('保存笔记失败:', error);
            this.showMessage('保存失败: 存储空间不足', 'error');
        }
    }

    loadNotes() {
        try {
            const savedNotes = localStorage.getItem('aces_markdown_notes');
            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
                this.updateNotesList();
            }
        } catch (error) {
            console.error('加载笔记失败:', error);
            this.showMessage('加载笔记失败', 'error');
        }
    }

    updateNotesList() {
        const notesList = document.getElementById('markdown-notes-list');
        if (!notesList) return;

        if (this.notes.length === 0) {
            notesList.innerHTML = `
                <div class="no-notes">
                    <i class="fas fa-file-alt"></i>
                    <p>暂无笔记</p>
                    <button class="debug-btn" onclick="ACES_APP.modules.get('markdown').newNote()">
                        创建新笔记
                    </button>
                </div>
            `;
            return;
        }

        const notesHTML = this.notes.map(note => `
            <div class="note-item ${this.currentNote && this.currentNote.id === note.id ? 'active' : ''}"
                 data-id="${note.id}">
                <div class="note-header">
                    <div class="note-title">${this.utils.sanitizeHTML(note.title)}</div>
                    <div class="note-actions">
                        <button class="note-action-btn" onclick="ACES_APP.modules.get('markdown').deleteNote('${note.id}')" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="note-excerpt">${this.utils.sanitizeHTML(note.excerpt)}</div>
                <div class="note-meta">
                    <span class="note-date">${new Date(note.updatedAt).toLocaleDateString()}</span>
                    <span class="note-word-count">${note.wordCount} 字</span>
                    ${note.tags.length > 0 ? `
                        <div class="note-tags">
                            ${note.tags.map(tag => `<span class="note-tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        notesList.innerHTML = notesHTML;
    }

    updateNoteInList(note) {
        const noteElement = document.querySelector(`.note-item[data-id="${note.id}"]`);
        if (!noteElement) return;

        const titleElement = noteElement.querySelector('.note-title');
        const excerptElement = noteElement.querySelector('.note-excerpt');
        const wordCountElement = noteElement.querySelector('.note-word-count');
        const dateElement = noteElement.querySelector('.note-date');

        if (titleElement) titleElement.textContent = note.title;
        if (excerptElement) excerptElement.textContent = note.excerpt;
        if (wordCountElement) wordCountElement.textContent = `${note.wordCount} 字`;
        if (dateElement) dateElement.textContent = new Date(note.updatedAt).toLocaleDateString();
    }

    searchNotes(query) {
        if (!query.trim()) {
            this.updateNotesList();
            return;
        }

        const filteredNotes = this.notes.filter(note =>
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        this.displaySearchResults(filteredNotes, query);
    }

    displaySearchResults(notes, query) {
        const notesList = document.getElementById('markdown-notes-list');
        if (!notesList) return;

        if (notes.length === 0) {
            notesList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>未找到包含 "${query}" 的笔记</p>
                </div>
            `;
            return;
        }

        const notesHTML = notes.map(note => {
            // 高亮搜索关键词
            const highlightedTitle = this.highlightText(note.title, query);
            const highlightedExcerpt = this.highlightText(note.excerpt, query);

            return `
                <div class="note-item search-result" data-id="${note.id}">
                    <div class="note-header">
                        <div class="note-title">${highlightedTitle}</div>
                    </div>
                    <div class="note-excerpt">${highlightedExcerpt}</div>
                    <div class="note-meta">
                        <span class="note-date">${new Date(note.updatedAt).toLocaleDateString()}</span>
                        <span class="note-word-count">${note.wordCount} 字</span>
                    </div>
                </div>
            `;
        }).join('');

        notesList.innerHTML = notesHTML;
    }

    highlightText(text, query) {
        if (!query) return this.utils.sanitizeHTML(text);

        const regex = new RegExp(`(${this.utils.escapeRegex(query)})`, 'gi');
        return this.utils.sanitizeHTML(text).replace(regex, '<mark>$1</mark>');
    }

    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `markdown-message markdown-message-${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="markdown-message-close">&times;</button>
        `;

        // 添加到消息容器
        const messageContainer = document.getElementById('markdown-message-container') ||
                                this.createMessageContainer();

        messageContainer.appendChild(messageElement);

        // 自动消失
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);

        // 点击关闭
        messageElement.querySelector('.markdown-message-close').addEventListener('click', () => {
            messageElement.remove();
        });
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'markdown-message-container';
        container.className = 'markdown-message-container';

        const markdownContent = document.getElementById('markdown-content');
        if (markdownContent) {
            markdownContent.appendChild(container);
        }

        return container;
    }

    getMessageIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    // 获取当前笔记
    getCurrentNote() {
        return this.currentNote;
    }

    // 获取所有笔记
    getAllNotes() {
        return this.notes;
    }

    // 获取笔记统计
    getNotesStats() {
        const totalWords = this.notes.reduce((sum, note) => sum + (note.wordCount || 0), 0);
        const totalNotes = this.notes.length;
        const latestUpdate = this.notes.length > 0 ?
            new Date(Math.max(...this.notes.map(n => new Date(n.updatedAt)))) : null;

        return {
            totalNotes,
            totalWords,
            latestUpdate,
            averageWords: totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0
        };
    }

    // 导出所有笔记
    exportAllNotes() {
        if (this.notes.length === 0) {
            this.showMessage('没有可导出的笔记', 'warning');
            return;
        }

        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            noteCount: this.notes.length,
            notes: this.notes
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `aces-notes-backup-${new Date().getTime()}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
        this.showMessage(`已导出 ${this.notes.length} 条笔记`, 'success');
    }

    // 导入笔记备份
    importBackup(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);

                if (backupData.notes && Array.isArray(backupData.notes)) {
                    // 合并笔记，避免ID冲突
                    backupData.notes.forEach(importedNote => {
                        const existingIndex = this.notes.findIndex(n => n.id === importedNote.id);
                        if (existingIndex >= 0) {
                            // 更新现有笔记
                            this.notes[existingIndex] = { ...this.notes[existingIndex], ...importedNote };
                        } else {
                            // 添加新笔记
                            this.notes.push(importedNote);
                        }
                    });

                    this.saveNotes();
                    this.updateNotesList();
                    this.showMessage(`成功导入 ${backupData.notes.length} 条笔记`, 'success');
                } else {
                    throw new Error('无效的备份文件格式');
                }
            } catch (error) {
                this.showMessage(`导入失败: ${error.message}`, 'error');
            }
        };
        reader.onerror = () => {
            this.showMessage('文件读取失败', 'error');
        };
        reader.readAsText(file);
    }

    // 清理资源
    cleanup() {
        // 保存当前笔记
        if (this.currentNote) {
            this.autoSave();
        }

        this.notes = [];
        this.currentNote = null;
        this.converter = null;
        this.isInitialized = false;

        console.log('Markdown模块清理完成');
    }
}