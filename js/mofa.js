document.addEventListener("DOMContentLoaded", initializePage);

function initializePage() {
  setupFullscreenVideo();
  setupScrollAnimation();
  setupNavbarShrink();
  setupImageSliders();
  setupExpandableItems();
  setupScenariosSlider();
  pageLoadAnimation();
  scrollAnimation();
  buttonClickAnimation();
  setupVideoPlayPause();
}

function setupFullscreenVideo() {
  const video = document.getElementById("intro-video");
  const fullscreenToggle = document.querySelector(".fullscreen-toggle");

  fullscreenToggle?.addEventListener("click", () => {
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

  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    navbar.style.transform = scrollTop > lastScrollTop ? "translateY(-100%)" : "translateY(0)";
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, false);
}

function setupImageSliders() {
  const sliders = document.querySelectorAll(".highlight-images");
  console.log("Found sliders:", sliders.length);

  sliders.forEach((slider, index) => {
    const imageSlider = slider.querySelector(".image-slider");
    const images = imageSlider.querySelectorAll("img");
    console.log(`Slider ${index + 1} images:`, images.length);

    // 在这里设置延迟加载
    setupLazyLoading(images);

    const prevButton = slider.querySelector(".slider-prev");
    const nextButton = slider.querySelector(".slider-next");
    let currentIndex = 0;

    function updateSlider() {
      requestAnimationFrame(() => {
        imageSlider.style.transition = "transform 0.3s ease-out";
        imageSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
        images.forEach((img, idx) => {
          img.style.transition = "opacity 0.3s ease-out";
          img.style.opacity = idx === currentIndex ? "1" : "0";
          // 确保当前图片已加载
          if (idx === currentIndex && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        });
      });
    }

    function adjustImages() {
      images.forEach(img => {
        if (img.complete) {
          adjustImagePosition(img);
        } else {
          img.onload = () => adjustImagePosition(img);
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

    setupTouchNavigation(imageSlider, () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateSlider();
    });

    // 初始化时调整图片并更新滑块
    adjustImages();
    updateSlider();

    // 使用防抖函数来处理 resize 事件
    const debouncedAdjust = debounce(adjustImages, 250);
    window.addEventListener("resize", debouncedAdjust);

    // 延迟加载图片
    setupLazyLoading(images);
  });
}

function setupTouchNavigation(element, nextImageFunction) {
  let touchStartX = 0;
  let touchEndX = 0;

  element.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  element.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextImageFunction();
    } else if (touchEndX - touchStartX > 50) {
      nextImageFunction(); // 可以改为上一张图片的函数
    }
  }, false);
}

function adjustImagePosition(img) {
  const container = img.closest(".highlight-images");
  if (!container) {
    console.error("Container not found for image:", img);
    return;
  }
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

function setupExpandableItems() {
  const expandableHeaders = document.querySelectorAll(".expandable-header");
  expandableHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      header.classList.toggle("active");
      const content = header.nextElementSibling;
      content.style.maxHeight = header.classList.contains("active") 
        ? `${content.scrollHeight}px` 
        : "0";
    });
  });
}

function setupScenariosSlider() {
  const slider = document.querySelector(".scenarios-slider");
  const prevButton = document.querySelector(".scenarios-container .slider-prev");
  const nextButton = document.querySelector(".scenarios-container .slider-next");
  const scenarios = document.querySelectorAll(".scenario");
  let currentIndex = 0;

  // 设置场景图片的延迟加载
  const scenarioImages = slider.querySelectorAll("img");
  setupLazyLoading(scenarioImages);

  function updateSlider() {
    const scenarioWidth = scenarios[0].offsetWidth + 20;
    slider.style.transform = `translateX(-${currentIndex * scenarioWidth}px)`;

    // 确保当前可见的图片已加载
    scenarios.forEach((scenario, index) => {
      if (index >= currentIndex && index < currentIndex + 3) {
        const img = scenario.querySelector("img");
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      }
    });
  }

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < scenarios.length - 3) {
      currentIndex++;
      updateSlider();
    }
  });

  updateSlider();
  window.addEventListener("resize", updateSlider);
}

function pageLoadAnimation() {
  const sections = document.querySelectorAll(".mofa-content > section");
  sections.forEach((section, index) => {
    section.style.opacity = "0";
    setTimeout(() => {
      section.style.transition = "opacity 0.5s ease-out";
      section.style.opacity = "1";
    }, index * 200);
  });
}

function scrollAnimation() {
  const elements = document.querySelectorAll(
    ".highlight-item, .expandable-item, .scenario"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    observer.observe(element);
  });
}

function buttonClickAnimation() {
  const buttons = document.querySelectorAll(
    ".cta-button, .expandable-header, .slider-prev, .slider-next"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      this.appendChild(ripple);
      const size = Math.max(this.offsetWidth, this.offsetHeight);
      const rect = this.getBoundingClientRect();
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.classList.add("active");
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

function setupVideoPlayPause() {
  const video = document.getElementById("intro-video");
  const overlay = document.querySelector(".video-overlay");

  if (video && overlay) {
    let isFirstClick = true;
    let isPlaying = false;

    overlay.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();

      if (isFirstClick) {
        video.muted = false;
        video.play();
        isFirstClick = false;
        isPlaying = true;
      } else {
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
        isPlaying = !isPlaying;
      }
    });
  }
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 延迟加载图片
function setupLazyLoading(images) {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, options);

  images.forEach(img => {
    if (!img.dataset.src) {
      img.dataset.src = img.src;
      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // 占位图
    }
    observer.observe(img);
  });
}