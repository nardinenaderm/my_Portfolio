document.addEventListener('DOMContentLoaded', function() {
    // Get all software buttons
    const softwareButtons = document.querySelectorAll('.software-button');
    
    // Add event listeners to each button
    softwareButtons.forEach(button => {
        const video = button.querySelector('.software-video');
        
        // When hovering over the button
        button.addEventListener('mouseenter', function() {
            // Play the video
            video.play().catch(e => {
                console.log('Video play failed:', e);
            });
            
            // Scale up the button
            this.style.transform = 'scale(1.08)';
        });
        
        // When moving mouse out of the button
        button.addEventListener('mouseleave', function() {
            // Pause the video
            video.pause();
            video.currentTime = 0;
            
            // Reset the button scale
            this.style.transform = 'scale(1)';
        });
        
        // When clicking the button
        button.addEventListener('click', function() {
            const software = this.getAttribute('data-software');
            console.log(`Opening projects for: ${software}`);
            // Here you would typically navigate to a detailed page
            // or show a modal with project details
        });
    });
    
    // Preload videos for better performance
    function preloadVideos() {
        softwareButtons.forEach(button => {
            const video = button.querySelector('.software-video');
            video.preload = 'auto';
        });
    }
    
    preloadVideos();
});