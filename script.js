     document.addEventListener('DOMContentLoaded', function() {
            const scrollIndicator = document.getElementById('scroll-indicator');
            const aboutMeSection = document.getElementById('about-me-section');
            const backgroundImage = document.getElementById('background-image');
            const secondImage = document.getElementById('second-image');
            const portfolioSections = document.querySelectorAll('.portfolio-section');
            const toolButtons = document.querySelectorAll('.tool-button');
            
            // Set initial position
            backgroundImage.style.transform = 'translateY(0)';

            // Initialize 3D flowers with imported models
            initFlowersWithModels();

            // Handle scroll events
            window.addEventListener('scroll', function() {
                const scrollY = window.scrollY;
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                const scrollPercentage = scrollY / maxScroll;

                // Move background image upward as you scroll down
                const backgroundOffset = -scrollY * 0.3;
                backgroundImage.style.transform = `translateY(${backgroundOffset}px)`;

                // Move second image to the right as you scroll down
                const imageOffset = scrollY * 1.5;
                secondImage.style.transform = `translateY(-50%) translateX(${imageOffset}px)`;

                // Hide scroll indicator after scrolling a bit
                if (scrollY > 100) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }

                // Show "About Me" section when scrolling down
                const showThreshold = window.innerHeight * 0.5;
                if (scrollY > showThreshold) {
                    aboutMeSection.classList.add('visible');
                } else {
                    aboutMeSection.classList.remove('visible');
                }

                // Check if portfolio sections are in view
                portfolioSections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollY > sectionTop - window.innerHeight * 0.7) {
                        section.classList.add('visible');
                    }
                });

                // Update scroll text
                if (scrollPercentage > 0.05) {
                    scrollIndicator.querySelector('span').textContent = `${Math.round(scrollPercentage * 100)}% viewed`;
                }
            });

            // Add click events to tool buttons
            toolButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const targetSection = this.getAttribute('data-section');
                    const sectionElement = document.getElementById(targetSection);
                    
                    if (sectionElement) {
                        // Smooth scroll to the section
                        sectionElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

        });