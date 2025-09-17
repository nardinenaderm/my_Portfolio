document.addEventListener('DOMContentLoaded', function() {
    // Get all sections and nav items
    const sections = document.querySelectorAll('.showcase-section');
    const navItems = document.querySelectorAll('.nav-item');
    const navIndicator = document.querySelector('.nav-indicator');
    
    // Function to update navigation indicator
    function updateNavIndicator() {
        // Find current visible section
        let currentSection = '';
    }
}
)


// Add this to your existing showcase.js if needed
function playAutoRigVideo() {
    const video = document.querySelector('.autorig-video');
    const placeholder = document.querySelector('.autorig-video-container .video-placeholder');
    
    if (video) {
        placeholder.style.display = 'none';
        video.style.display = 'block';
        video.play();
    }
}

function playSyncVideo() {
    const video = document.querySelector('.sync-video');
    const placeholder = document.querySelector('.sync-video-container .video-placeholder');
    
    if (video) {
        placeholder.style.display = 'none';
        video.style.display = 'block';
        video.play();
    }
}