document.addEventListener('DOMContentLoaded', function() {
    // Get all software buttons
    const softwareButtons = document.querySelectorAll('.software-button');
    
    // Function to check if video exists
    function checkVideoSource(video) {
        const source = video.querySelector('source');
        if (!source) {
            console.error('No source element found for video');
            return false;
        }
        
        const src = source.getAttribute('src');
        if (!src) {
            console.error('No src attribute found for video source');
            return false;
        }
        
        return true;
    }
    
    // Preload videos for better performance
    function preloadVideos() {
        softwareButtons.forEach(button => {
            const video = button.querySelector('.software-video');
            
            if (!checkVideoSource(video)) {
                console.error('Video source issue for:', button.getAttribute('data-software'));
                return;
            }
            
            video.preload = 'auto';
            video.loop = true;
            video.muted = true;
            
            // Add error handling
            video.addEventListener('error', function() {
                console.error('Error loading video for:', button.getAttribute('data-software'));
                console.error('Video error details:', video.error);
            });
            
            video.addEventListener('loadeddata', function() {
                console.log('Video loaded successfully for:', button.getAttribute('data-software'));
            });
        });
    }
    
    // Add event listeners to each button
    softwareButtons.forEach(button => {
        const video = button.querySelector('.software-video');
        
        // Check if video source exists
        if (!checkVideoSource(video)) {
            console.error('Skipping button due to video source issues:', button.getAttribute('data-software'));
            return;
        }
        
        // When hovering over the button
        button.addEventListener('mouseenter', function() {
            console.log('Hovering over:', this.getAttribute('data-software'));
            
            // Try to play the video
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.error('Video play failed for:', this.getAttribute('data-software'), e);
                    // Fallback: show a message or alternative content
                    this.classList.add('video-error');
                });
            }
            
            // Scale up the button
            this.style.transform = 'scale(1.05)';
        });
        
        // When moving mouse out of the button
        button.addEventListener('mouseleave', function() {
            // Pause the video
            video.pause();
            video.currentTime = 0;
            
            // Reset the button scale
            this.style.transform = 'scale(1)';
            this.classList.remove('video-error');
        });
        
        // When clicking the button
        button.addEventListener('click', function() {
            const software = this.getAttribute('data-software');
            console.log(`Opening projects for: ${software}`);
        });
    });
    
    // Initialize video preloading
    preloadVideos();
    
    // Add debug info to console
    console.log('Total software buttons found:', softwareButtons.length);
});