document.addEventListener('DOMContentLoaded', function() {
    // Get all software buttons
    const softwareButtons = document.querySelectorAll('.software-button');
    
    // Add event listeners to each button
    softwareButtons.forEach(button => {
        const video = button.querySelector('.software-video');
        
        // Only add video functionality if video exists
        if (video) {
            // When hovering over the button
            button.addEventListener('mouseenter', function() {
                // Try to play the video
                const playPromise = video.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.error('Video play failed:', e);
                    });
                }
            });
            
            // When moving mouse out of the button
            button.addEventListener('mouseleave', function() {
                // Pause the video
                video.pause();
                video.currentTime = 0;
            });
        }
        
        // Remove the click event listener since we're using anchor tags now
        // The native anchor tag behavior will handle navigation
    });
});