/**
 * Device-specific fixes and enhancements
 * This file contains code to improve the website experience on different devices
 */

// Detect iOS devices
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Fix for iOS viewport height issues (the 100vh problem)
if (isIOS) {
    const setVhProperty = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', setVhProperty);
    setVhProperty();
}

// Fix for Chrome/Chromebook's scrollbar issues
if (/Chrome/.test(navigator.userAgent)) {
    document.documentElement.classList.add('chrome');
    
    // Add custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
        .chrome .sidebar::-webkit-scrollbar {
            width: 8px;
        }
        .chrome .sidebar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .chrome .sidebar::-webkit-scrollbar-thumb {
            background: rgba(67, 198, 172, 0.3);
            border-radius: 10px;
        }
        .chrome .sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(67, 198, 172, 0.5);
        }
    `;
    document.head.appendChild(style);
}

// Fix tap delay on mobile devices
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

// Add FastClick library for removing 300ms delay on mobile taps
document.addEventListener('DOMContentLoaded', function() {
    if (typeof FastClick === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js';
        script.integrity = 'sha512-0U7t1QNZC7GYTqGcJhgOj3dXZVLd0Ayi6LDBCoXrI4x2Y60yAMw/aNeqXCvGBBPUfYah7b3/FrJP4XjLF9SXw==';
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        script.onload = function() {
            FastClick.attach(document.body);
        };
        document.head.appendChild(script);
    }
});

// Handle keyboard accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Make category items keyboard navigable
    document.querySelectorAll('.category-item').forEach(function(item) {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (this.getAttribute('data-category')) {
                    const category = this.getAttribute('data-category');
                    // Implement category filtering functionality here
                    console.log('Selected category (keyboard):', category);
                }
            }
        });
    });
});

// Fix viewport height on orientation change
window.addEventListener('orientationchange', function() {
    // Small timeout to let the orientation change complete
    setTimeout(function() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Force redraw of the sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
            setTimeout(() => {
                sidebar.style.display = '';
            }, 10);
        }
    }, 200);
});
