document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('certificateModal');
    
    window.openModal = function(imgElement) {
        if (typeof imgElement === 'string') {
            // If it's a string, it's a path to an image
            document.getElementById('modalImage').src = imgElement;
        } else {
            // If it's an element, get its src
            document.getElementById('modalImage').src = imgElement.src;
        }
        modal.style.display = 'block';
    }
    
    window.closeModal = function() {
        modal.style.display = 'none';
    }
    
    // Close modal when clicking outside the image
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
});