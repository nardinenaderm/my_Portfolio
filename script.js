
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

            // Function to initialize 3D flowers with imported models
// Function to initialize 3D flowers with imported models
function initFlowersWithModels() {
    // Create flower in top container - with rotation adjustment
    loadFlowerModel(
        'flower-container-top', 
        'models/cosmos_flower/scene.gltf',
        { x: -Math.PI/2, y: 0, z: 185 } // Rotate to face the screen
    );
    
    // Create flower in bottom container - with different rotation
    loadFlowerModel(
        'flower-container-bottom', 
        'models/cosmos_flower/scene.gltf',
        { x: -Math.PI/2, y: Math.PI/4, z: 185 } // Slight variation
    );
}

function loadFlowerModel(containerId, modelUrl, rotationAdjustment = { x: 0, y: 0, z: 0 }) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = null;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer with better settings
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaOutput = true;
    
    // Remove loading indicator
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Add ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Add directional light as the main light source (simulating sun)
    const directionalLight = new THREE.DirectionalLight(0xfffaf0, 0.8);
    directionalLight.position.set(1, 2, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Add a fill light to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0x7fbfff, 0.3);
    fillLight.position.set(-2, 1, -1);
    scene.add(fillLight);
    
    // Add a rim light to create highlights on the edges
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 1, -2);
    scene.add(rimLight);
    
    // Add a point light for additional depth and warmth
    const pointLight = new THREE.PointLight(0xffd700, 0.5, 10);
    pointLight.position.set(1, -1, 2);
    scene.add(pointLight);
    
    // Load model
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        modelUrl,
        function(gltf) {
            const model = gltf.scene;
            
            // Enable shadows for the model if it has materials
            model.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Enhance materials for better lighting response
                    if (node.material) {
                        node.material.metalness = 0.1;
                        node.material.roughness = 0.8;
                    }
                }
            });
            
            // Scale and position the model
            model.scale.set(2, 2, 2);
            model.position.set(0, 0, -16);
            
            // Apply rotation adjustment to make the flower face the viewer
            model.rotation.x = rotationAdjustment.x;
            model.rotation.y = rotationAdjustment.y;
            model.rotation.z = rotationAdjustment.z;
            
            // Add the model to the scene
            scene.add(model);
            
            // Add a subtle rotation to show the 3D form
            function animate() {
                requestAnimationFrame(animate);
                
                // Very subtle rotation to show the 3D form
                model.rotation.y += 0.001;
                
                // Gentle floating movement
                model.position.y = Math.sin(Date.now() * 0.001) * 0.3;
                
                renderer.render(scene, camera);
            }
            
            animate();
        },
        function(xhr) {
            // Loading progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('Error loading model:', error);
            
            // Fallback to basic flower if model fails to load
            createBasicFlower(scene, rotationAdjustment);
            
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            
            animate();
        }
    );
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
}

        });