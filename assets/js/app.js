// WebStack.cc 应用脚本

class WebStackApp {
    constructor() {
        this.data = null;
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.renderContent();
            this.bindEvents();
        } catch (error) {
            this.showError('加载数据失败，请刷新页面重试');
            console.error('Error loading data:', error);
        }
    }

    async loadData() {
        const response = await fetch('./websites.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.data = await response.json();
    }

    renderContent() {
        const content = document.getElementById('content');
        if (!content) return;

        if (!this.data || !this.data.categories) {
            this.showError('数据格式错误');
            return;
        }

        content.innerHTML = '';

        this.data.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            content.appendChild(categoryElement);
        });
    }

    createCategoryElement(category) {
        const categoryDiv = document.createElement('section');
        categoryDiv.className = 'category';
        categoryDiv.id = category.id;

        // 分类标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'category-title';
        
        const icon = this.getIcon(category.icon);
        const titleHTML = `
            <span class="icon">${icon}</span>
            <h2>${category.name}</h2>
        `;
        titleDiv.innerHTML = titleHTML;

        categoryDiv.appendChild(titleDiv);

        // 子分类或网站列表
        if (category.subcategories && category.subcategories.length > 0) {
            // 有子分类的情况
            category.subcategories.forEach(subcategory => {
                const subcategoryDiv = this.createSubcategoryElement(subcategory);
                categoryDiv.appendChild(subcategoryDiv);
            });
        } else if (category.websites && category.websites.length > 0) {
            // 直接是网站列表
            const gridDiv = this.createWebsitesGrid(category.websites);
            categoryDiv.appendChild(gridDiv);
        }

        return categoryDiv;
    }

    createSubcategoryElement(subcategory) {
        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.className = 'subcategory';
        subcategoryDiv.id = subcategory.id;

        // 子分类标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'subcategory-title';
        const titleHTML = `
            <h3>${subcategory.name}</h3>
            <span class="label">${subcategory.websites ? subcategory.websites.length : 0}</span>
        `;
        titleDiv.innerHTML = titleHTML;

        subcategoryDiv.appendChild(titleDiv);

        // 网站网格
        if (subcategory.websites && subcategory.websites.length > 0) {
            const gridDiv = this.createWebsitesGrid(subcategory.websites);
            subcategoryDiv.appendChild(gridDiv);
        }

        return subcategoryDiv;
    }

    createWebsitesGrid(websites) {
        const gridDiv = document.createElement('div');
        gridDiv.className = 'websites-grid';

        websites.forEach(website => {
            const card = this.createWebsiteCard(website);
            gridDiv.appendChild(card);
        });

        return gridDiv;
    }

    createWebsiteCard(website) {
        const card = document.createElement('a');
        card.className = 'website-card';
        card.href = website.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.title = website.description;

        // 处理logo图片
        let logoSrc = `../assets/images/logos/${website.logo}`;
        if (window.location.pathname.includes('/index.html') || window.location.pathname === '/') {
            logoSrc = `./assets/images/logos/${website.logo}`;
        }

        const cardHTML = `
            <img src="${logoSrc}" alt="${website.name}" class="website-logo" 
                 onerror="this.src='../assets/images/logos/default.png'">
            <div class="website-info">
                <h3 class="website-name">${website.name}</h3>
                <p class="website-description">${website.description}</p>
            </div>
        `;

        card.innerHTML = cardHTML;

        // 添加点击事件
        card.addEventListener('click', (e) => {
            // 可以在这里添加统计代码
            this.trackClick(website.name);
        });

        return card;
    }

    getIcon(iconName) {
        const icons = {
            'star': '⭐',
            'doc': '📄',
            'lightbulb': '💡',
            'thumbs-up': '👍',
            'diamond': '💎',
            'pencil': '✏️',
            'user': '👥',
            'recommended': '⭐',
            'community': '📄',
            'inspiration': '💡',
            'resources': '👍',
            'tools': '💎',
            'learning': '✏️',
            'teams': '👥'
        };
        return icons[iconName] || '🔗';
    }

    bindEvents() {
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 更新导航状态
                    document.querySelectorAll('.nav-list a').forEach(link => {
                        link.classList.remove('active');
                    });
                    anchor.classList.add('active');
                }
            });
        });

        // 滚动时更新导航状态
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('.category');
        const navLinks = document.querySelectorAll('.nav-list a');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    showLoading() {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div class="loading">正在加载...</div>';
        }
    }

    showError(message) {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    showEmpty(message = '暂无数据') {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `
                <div class="empty-state">
                    <h3>${message}</h3>
                    <p>请稍后再试或联系管理员</p>
                </div>
            `;
        }
    }

    trackClick(websiteName) {
        // 可以在这里添加统计分析代码
        console.log('Clicked:', websiteName);
        
        // 例如：发送到Google Analytics
        // gtag('event', 'click', {
        //     event_category: 'website',
        //     event_label: websiteName
        // });
    }
}

// 当页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebStackApp();
});

// 导出供其他脚本使用
window.WebStackApp = WebStackApp;