document.addEventListener('DOMContentLoaded', function() {
    // 视频全屏播放
    const video = document.getElementById('intro-video');
    const fullscreenToggle = document.querySelector('.fullscreen-toggle');

    fullscreenToggle.addEventListener('click', function() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
        video.muted = false;
    });

    // 滚动动画
    const animatedElements = document.querySelectorAll('.product-highlights, .operation-requirements, .application-scenarios');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // 导航栏缩小效果
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // 图片轮播效果
    function setupImageCarousel() {
        const carousels = document.querySelectorAll('.image-carousel');
        carousels.forEach(carousel => {
            const images = carousel.querySelectorAll('img');
            let currentIndex = 0;

            setInterval(() => {
                images[currentIndex].style.opacity = 0;
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].style.opacity = 1;
            }, 3000);
        });
    }

    // 在页面加载完成后调用设置函数
    setupImageCarousel();

    // 在现有的 mofa.js 文件中添加以下函数

    function setupImageStacks() {
        const imageStacks = document.querySelectorAll('.image-stack');
        
        imageStacks.forEach(stack => {
            const container = stack.parentElement;
            const images = stack.querySelectorAll('img');
            let isDragging = false;
            let startX, startScrollLeft;
            let dragDistance = 0;
            let velocity = 0;
            let animationId = null;

            // 初始化第一张图片为激活状态
            updateActiveImage(stack, 0);

            // 禁用图片拖放
            images.forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            });

            // 鼠标拖动功能
            container.addEventListener('mousedown', (e) => {
                isDragging = true;
                container.style.cursor = 'grabbing';
                startX = e.pageX - container.offsetLeft;
                startScrollLeft = container.scrollLeft;
                dragDistance = 0;
                cancelAnimationFrame(animationId);
            });

            container.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX);
                container.scrollLeft = startScrollLeft - walk;
                dragDistance += Math.abs(walk);
                velocity = walk;
            });

            container.addEventListener('mouseup', endDrag);
            container.addEventListener('mouseleave', endDrag);

            function endDrag() {
                if (!isDragging) return;
                isDragging = false;
                container.style.cursor = 'grab';
                startMomentumScroll();
            }

            function startMomentumScroll() {
                cancelAnimationFrame(animationId);
                function momentumScroll() {
                    if (Math.abs(velocity) > 0.1) {
                        container.scrollLeft -= velocity;
                        velocity *= 0.95; // 减少速度
                        animationId = requestAnimationFrame(momentumScroll);
                    } else {
                        updateActiveImage(stack);
                    }
                }
                animationId = requestAnimationFrame(momentumScroll);
            }

            // 触摸滑动支持
            container.addEventListener('touchstart', (e) => {
                isDragging = true;
                startX = e.touches[0].clientX - container.offsetLeft;
                startScrollLeft = container.scrollLeft;
                dragDistance = 0;
                cancelAnimationFrame(animationId);
            });

            container.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const x = e.touches[0].clientX - container.offsetLeft;
                const walk = (x - startX);
                container.scrollLeft = startScrollLeft - walk;
                dragDistance += Math.abs(walk);
                velocity = walk;
            });

            container.addEventListener('touchend', endDrag);

            // 点击切换图片
            container.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG' && dragDistance < 5) {
                    const clickedIndex = Array.from(images).indexOf(e.target);
                    updateActiveImage(stack, clickedIndex, true);
                }
                dragDistance = 0; // 重置拖动距离
            });
        });
    }

    function updateActiveImage(stack, clickedIndex = null, isClick = false) {
        const container = stack.parentElement;
        const images = stack.querySelectorAll('img');
        const containerWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;
        const isRightAligned = container.closest('.highlight-item').classList.contains('reverse');

        let maxVisibleArea = 0;
        let activeIndex = 0;

        images.forEach((img, index) => {
            const imgLeft = img.offsetLeft - scrollLeft;
            const imgRight = imgLeft + img.offsetWidth;
            const visibleWidth = Math.min(imgRight, containerWidth) - Math.max(imgLeft, 0);
            const visibleArea = Math.max(0, visibleWidth) / img.offsetWidth;

            if (visibleArea > maxVisibleArea) {
                maxVisibleArea = visibleArea;
                activeIndex = index;
            }

            // 重置所有图片样式
            img.style.transform = 'scale(1)';
            img.style.opacity = '0.7';
            img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        });

        // 如果有点击的图片，优先使用点击的索引
        const targetIndex = clickedIndex !== null ? clickedIndex : activeIndex;

        // 应用激活样式
        const activeImg = images[targetIndex];
        activeImg.style.transform = 'scale(1.05)';
        activeImg.style.opacity = '1';

        if (isClick) {
            const targetLeft = activeImg.offsetLeft;
            const targetRight = targetLeft + activeImg.offsetWidth;
            const maxScroll = stack.scrollWidth - containerWidth;

            if (isRightAligned) {
                // 右对齐情况
                let scrollAmount = targetRight - containerWidth;
                scrollAmount = Math.min(scrollAmount, maxScroll);
                container.scrollLeft = maxScroll - scrollAmount;
            } else {
                // 左对齐情况
                container.scrollLeft = Math.max(0, Math.min(targetLeft, maxScroll));
            }
        }
    }

    // 在 DOMContentLoaded 事件监听器中调用这个函数
    setupImageStacks();
});