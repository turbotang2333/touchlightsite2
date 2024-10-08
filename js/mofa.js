document.addEventListener("DOMContentLoaded", function () {
  // 视频全屏播放
  setupFullscreenVideo();

  // 滚动动画
  setupScrollAnimation();

  // 导航栏缩小效果
  setupNavbarShrink();

  // 图片轮播效果
  setupImageCarousels();

  // 新增图片滑动效果
  setupImageSliders();

  // 添加展开/折叠交互
  setupExpandableItems();

  // 添加到文件末尾
  setupScenariosSlider();

  // 页面加载动画
  pageLoadAnimation();

  // 滚动动画
  scrollAnimation();

  // 按钮点击动画
  buttonClickAnimation();
});

function setupFullscreenVideo() {
  const video = document.getElementById("intro-video");
  const fullscreenToggle = document.querySelector(".fullscreen-toggle");

  fullscreenToggle?.addEventListener("click", function () {
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
}

function setupScrollAnimation() {
  const animatedElements = document.querySelectorAll(
    ".product-highlights, .operation-requirements, .application-scenarios"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => observer.observe(element));
}

function setupNavbarShrink() {
  const navbar = document.querySelector(".navbar");
  let lastScrollTop = 0;

  window.addEventListener(
    "scroll",
    function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      navbar.style.transform =
        scrollTop > lastScrollTop ? "translateY(-100%)" : "translateY(0)";
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    },
    false
  );
}

function setupImageCarousels() {
  const imageStacks = document.querySelectorAll(".image-stack");

  imageStacks.forEach((stack) => {
    const images = stack.querySelectorAll("img");
    let currentIndex = 0;

    function showImage(index) {
      images.forEach((img, i) => {
        if (i === index) {
          img.classList.add("active");
          img.style.opacity = "1";
          img.style.transform = "scale(1.05)";

          // 确保图片已载
          if (img.complete) {
            adjustImagePosition(img);
          } else {
            img.onload = () => adjustImagePosition(img);
          }
        } else {
          img.classList.remove("active");
          img.style.opacity = "0";
          img.style.transform = "scale(1)";
        }
      });
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }

    // 初始显示第一张图片
    showImage(0);

    // 每 3 秒切换一次图片
    setInterval(nextImage, 3000);

    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    stack.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    stack.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          nextImage();
        } else if (touchEndX - touchStartX > 50) {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          showImage(currentIndex);
        }
      },
      false
    );
  });
}

function adjustImagePosition(img) {
  const container = img.closest(".image-stack");
  const containerAspect = container.clientWidth / container.clientHeight;
  const imageAspect = img.naturalWidth / img.naturalHeight;

  if (imageAspect > containerAspect) {
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.top = "50%";
    img.style.left = "0";
    img.style.transform = "translateY(-50%)";
  } else {
    img.style.width = "auto";
    img.style.height = "100%";
    img.style.top = "0";
    img.style.left = "50%";
    img.style.transform = "translateX(-50%)";
  }
}

function setupImageSliders() {
  const sliders = document.querySelectorAll(".highlight-images");

  sliders.forEach((slider) => {
    const imageSlider = slider.querySelector(".image-slider");
    const images = imageSlider.querySelectorAll("img");
    const prevButton = slider.querySelector(".slider-prev");
    const nextButton = slider.querySelector(".slider-next");
    let currentIndex = 0;

    function updateSlider() {
      imageSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
      images.forEach((img, index) => {
        if (index === currentIndex) {
          img.style.opacity = "1";
        } else {
          img.style.opacity = "0";
        }
      });
    }

    function adjustImages() {
      images.forEach((img) => {
        const containerAspect = 4 / 3;
        const imageAspect = img.naturalWidth / img.naturalHeight;

        if (imageAspect > containerAspect) {
          img.style.width = "100%";
          img.style.height = "auto";
          img.style.top = "50%";
          img.style.left = "0";
          img.style.transform = "translateY(-50%)";
        } else {
          img.style.width = "auto";
          img.style.height = "100%";
          img.style.top = "0";
          img.style.left = "50%";
          img.style.transform = "translateX(-50%)";
        }
      });
    }

    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateSlider();
    });

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateSlider();
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    imageSlider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      false
    );

    imageSlider.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) {
          nextButton.click();
        } else if (touchEndX - touchStartX > 50) {
          prevButton.click();
        }
      },
      false
    );

    // 初始化显示
    adjustImages();
    updateSlider();

    // 窗口大小改变时重新调整图片
    window.addEventListener("resize", adjustImages);
  });
}

function createButton(className, innerHTML) {
  const button = document.createElement("button");
  button.className = className;
  button.innerHTML = innerHTML;
  button.setAttribute(
    "aria-label",
    className === "slider-prev" ? "上一张" : "下一张"
  );
  return button;
}

// 添加到文件末尾
function setupExpandableItems() {
  const expandableHeaders = document.querySelectorAll('.expandable-header');
  expandableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      console.log('Header clicked'); // 添加这行来检查点击是否被触发
      header.classList.toggle('active');
      const content = header.nextElementSibling;
      if (header.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
}

// 确保在DOM加载完成后调用这个函数
document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM fully loaded'); // 添加这行来检查DOM是否已完全加载
  setupExpandableItems();
  // 其他现有的初始化代码...
  setupExpandableItems();
});

// 添加到文件末尾
function setupScenariosSlider() {
  const slider = document.querySelector('.scenarios-slider');
  const prevButton = document.querySelector('.slider-prev');
  const nextButton = document.querySelector('.slider-next');
  const scenarios = document.querySelectorAll('.scenario');
  let currentIndex = 0;

  function updateSlider() {
    const scenarioWidth = scenarios[0].offsetWidth + 20; // 包括右边距
    slider.style.transform = `translateX(-${currentIndex * scenarioWidth}px)`;
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < scenarios.length - 3) { // 假设一次显示3个场景
      currentIndex++;
      updateSlider();
    }
  });

  // 初始化显示
  updateSlider();

  // 窗口大小改变时重新计算
  window.addEventListener('resize', updateSlider);
}

// 确保在DOM加载完成后调用这个函数
document.addEventListener("DOMContentLoaded", function () {
  // 其他初始化代码...
  setupScenariosSlider();
});

// 页面加载动画
function pageLoadAnimation() {
  const sections = document.querySelectorAll('.mofa-content > section');
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    setTimeout(() => {
      section.style.transition = 'opacity 0.5s ease-out';
      section.style.opacity = '1';
    }, index * 200);
  });
}

// 滚动动画
function scrollAnimation() {
  const elements = document.querySelectorAll('.highlight-item, .expandable-item, .scenario');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    observer.observe(element);
  });
}

// 按钮点击动画
function buttonClickAnimation() {
  const buttons = document.querySelectorAll('.cta-button, .expandable-header, .slider-prev, .slider-next');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);
      const size = Math.max(this.offsetWidth, this.offsetHeight);
      const rect = this.getBoundingClientRect();
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.classList.add('active');
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// 在DOM加载完成后初始化动画
document.addEventListener('DOMContentLoaded', function() {
  pageLoadAnimation();
  scrollAnimation();
  buttonClickAnimation();
});