console.log('Script loaded');

document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 案例滑动功能
    const caseSlider = document.querySelector('.case-slider');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    const slides = document.querySelectorAll('.case-item');
    let currentSlide = 0;

    function goToSlide(n) {
        if (!slides.length) return; // 如果没有幻灯片，直接返回
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        caseSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
    }

    // 初始化第一个幻灯片
    goToSlide(0);

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 视差滚动效果
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        console.log('Parallax background element found');
        let lastScrollY = window.pageYOffset;

        function updateParallax() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const maxScroll = documentHeight - windowHeight;
            
            // 计算背景应该移动的最大距离
            const maxTranslateY = (documentHeight * 0.5) - windowHeight;
            
            // 使用 easeOutQuad 缓动函数来平滑过渡
            const progress = Math.min(scrollY / maxScroll, 1); // 限制进度最大为 1
            const easedProgress = 1 - (1 - progress) * (1 - progress);
            
            const translateY = Math.min(easedProgress * maxTranslateY, maxTranslateY);
            
            parallaxBackground.style.transform = `translateY(-${translateY}px)`;
        }

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateParallax);
        });

        // 初始化视差效果
        updateParallax();
    } else {
        console.error('Parallax background element not found');
    }

    // 汉堡菜单功能
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            navLinks.classList.toggle('show');
            document.body.classList.toggle('menu-open');
            console.log('Menu toggled', navLinks.classList.contains('show'));
        });

        // 点击导航链接后关闭菜单
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('show');
                document.body.classList.remove('menu-open');
            });
        });

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                navLinks.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
        });
    } else {
        console.error('Hamburger or nav-links element not found');
    }

    // 在文件末尾添加以下代码
    document.addEventListener('DOMContentLoaded', function() {
        const sloganMission = document.querySelector('.slogan-mission');
        
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );
        }
        
        function animateSloganMission() {
            if (isElementInViewport(sloganMission)) {
                sloganMission.classList.add('animate');
                window.removeEventListener('scroll', animateSloganMission);
            }
        }
        
        window.addEventListener('scroll', animateSloganMission);
        animateSloganMission(); // 初始检查，以防元素已经在视口中
    });

    // 移除 no-js 类，允许 JavaScript 动画
    document.body.classList.remove('no-js');

    // 添加视差滚动效果
    const parallaxBackground = document.querySelector('.parallax-background');
    const contentWrapper = document.querySelector('.content-wrapper');

    function updateParallax() {
        const parallaxBackground = document.querySelector('.parallax-background');
        if (parallaxBackground) {
            const scrollPosition = window.pageYOffset;
            parallaxBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallax);
    });

    // 初始化视差效果
    updateParallax();
});