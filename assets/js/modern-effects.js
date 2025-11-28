// 现代化动态效果 - WebStack.cc
document.addEventListener('DOMContentLoaded', function() {
    
    // 滚动进度条
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: ${scrollProgress}%;
                height: 3px;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                z-index: 9999;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        } else {
            progressBar.style.width = scrollProgress + '%';
        }
    }

    // 鼠标跟随效果
    function initMouseFollower() {
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(79, 172, 254, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX - 10 + 'px';
            follower.style.top = e.clientY - 10 + 'px';
        });

        // 在卡片上悬停时放大效果
        document.querySelectorAll('.xe-widget').forEach(card => {
            card.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(2)';
            });
            card.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
            });
        });
    }

    // 粒子效果
    function initParticles() {
        const particleCount = 15;
        const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                left: ${Math.random() * 100}vw;
                top: 100vh;
                opacity: 0.6;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            document.body.appendChild(particle);
        }
    }

    // 视差滚动效果
    function initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            document.querySelectorAll('.xe-widget').forEach((card, index) => {
                const speed = 0.1 + (index * 0.05);
                card.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // 卡片悬浮动画
    function initCardAnimations() {
        const cards = document.querySelectorAll('.xe-widget.xe-conversations');
        
        cards.forEach((card, index) => {
            // 添加进入动画延迟
            card.style.animationDelay = `${index * 0.1}s`;
            
            // 鼠标进入效果
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) rotateX(5deg) scale(1.02)';
                this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(79, 172, 254, 0.3)';
                
                // 添加光晕效果
                const glow = document.createElement('div');
                glow.className = 'card-glow';
                glow.style.cssText = `
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(45deg, #667eea, #764ba2, #4facfe, #00f2fe);
                    border-radius: 18px;
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    animation: borderRotate 3s linear infinite;
                `;
                this.style.position = 'relative';
                this.appendChild(glow);
                
                setTimeout(() => glow.style.opacity = '0.7', 100);
            });
            
            // 鼠标离开效果
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                
                const glow = this.querySelector('.card-glow');
                if (glow) {
                    glow.style.opacity = '0';
                    setTimeout(() => glow.remove(), 300);
                }
            });
        });
    }

    // 打字机效果
    function initTypewriter() {
        const titles = document.querySelectorAll('h4.text-gray');
        
        titles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            title.style.borderRight = '2px solid #4facfe';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        title.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // 当标题进入视口时开始打字机效果
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(title);
        });
    }

    // 平滑滚动增强
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 添加目标高亮效果
                    target.style.background = 'rgba(79, 172, 254, 0.1)';
                    target.style.borderRadius = '8px';
                    target.style.padding = '1rem';
                    target.style.margin = '1rem 0';
                    target.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        target.style.background = '';
                        target.style.padding = '';
                        target.style.margin = '';
                    }, 2000);
                }
            });
        });
    }

    // 懒加载增强
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                    
                    // 添加图片加载动画
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.8)';
                    img.style.transition = 'all 0.5s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                        img.style.transform = 'scale(1)';
                    };
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // 添加CSS动画关键帧
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes borderRotate {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .floating-particle {
                animation: float ${Math.random() * 10 + 10}s linear infinite;
            }
            
            .xe-widget {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .xe-widget:hover {
                transform: translateY(-8px) scale(1.02);
            }
            
            .card-glow {
                animation: borderRotate 3s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化所有效果
    function init() {
        addAnimationStyles();
        updateScrollProgress();
        initMouseFollower();
        initParticles();
        initCardAnimations();
        initTypewriter();
        initSmoothScroll();
        initLazyLoading();
        
        // 滚动事件监听
        window.addEventListener('scroll', updateScrollProgress);
        
        // 窗口大小改变时重新计算
        window.addEventListener('resize', () => {
            setTimeout(updateScrollProgress, 100);
        });
    }

    // 页面加载完成后初始化
    init();
    
    // 添加页面切换动画
    window.addEventListener('beforeunload', () => {
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.95)';
        document.body.style.transition = 'all 0.3s ease';
    });
});

// 添加触摸设备优化
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // 移除鼠标跟随效果
    const mouseFollower = document.querySelector('.mouse-follower');
    if (mouseFollower) {
        mouseFollower.remove();
    }
    
    // 调整动画以适应触摸设备
    const style = document.createElement('style');
    style.textContent = `
        .touch-device .xe-widget:hover {
            transform: translateY(-4px) !important;
        }
        
        .touch-device .floating-particle {
            display: none;
        }
    `;
    document.head.appendChild(style);
}