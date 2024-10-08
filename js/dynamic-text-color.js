const colorThief = new ColorThief();
const backgroundImage = new Image();
backgroundImage.crossOrigin = "Anonymous";
backgroundImage.src = 'images/tech_background.png';

backgroundImage.onload = function() {
    updateColors();
    window.addEventListener('scroll', updateColors);
};

function updateColors() {
    const missionSection = document.querySelector('.slogan-mission');
    const rect = missionSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        const y = Math.max(0, Math.min(backgroundImage.height - 1, rect.top + window.scrollY));
        const color = colorThief.getColor(backgroundImage, y);
        
        const textColor = getContrastColor(color);
        const backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`; // 降低背景不透明度
        
        missionSection.style.color = textColor;
        missionSection.style.backgroundColor = backgroundColor;
        
        // 更新子元素的颜色
        updateChildColors(missionSection, textColor);
    }
}

function getContrastColor(rgb) {
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    if (brightness > 128) {
        return `rgb(${Math.max(0, rgb[0] - 100)}, ${Math.max(0, rgb[1] - 100)}, ${Math.max(0, rgb[2] - 100)})`;
    } else {
        return `rgb(${Math.min(255, rgb[0] + 100)}, ${Math.min(255, rgb[1] + 100)}, ${Math.min(255, rgb[2] + 100)})`;
    }
}

function updateChildColors(element, color) {
    const children = element.querySelectorAll('h2, h3, p, li');
    children.forEach(child => {
        child.style.color = color;
    });
}