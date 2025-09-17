import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/loaders/RGBELoader.js';

class ModelViewer {
    constructor() {
        // ADD YOUR GLB MODEL LINKS HERE
        this.models = [
            {
                id: 'model-1',
                name: 'Character Rig',
                description: 'A fully rigged character with facial expressions and detailed controls.',
                tags: ['Maya', 'Rigging', 'Character'],
                glbPath: 'D:/Portfolio/my_Portfolio/models/sword.glb', // REPLACE WITH YOUR GLB LINK
                thumbnail: 'models/thumbnails/character_rig.jpg' // REPLACE WITH YOUR THUMBNAIL
            },
            {
                id: 'model-2',
                name: 'Mechanical Robot',
                description: 'Complex mechanical robot with IK/FK switching and custom controls.',
                tags: ['Maya', 'Rigging', 'Mechanical'],
                glbPath: 'D:/Portfolio/my_Portfolio/models/chair.glb', // REPLACE WITH YOUR GLB LINK
                thumbnail: 'models/thumbnails/robot_rig.jpg' // REPLACE WITH YOUR THUMBNAIL
            },
            {
                id: 'model-3',
                name: 'Creature Rig',
                description: 'Fantasy creature with wing controls and dynamic elements.',
                tags: ['Maya', 'Creature', 'Dynamic'],
                glbPath: 'D:/Portfolio/my_Portfolio/models/paintingSet.glb', // REPLACE WITH YOUR GLB LINK
                thumbnail: 'models/thumbnails/creature_rig.jpg' // REPLACE WITH YOUR THUMBNAIL
            },
            {
                id: 'model-4',
                name: 'Facial Rig',
                description: 'Advanced facial rig with blend shapes and muscle system.',
                tags: ['Maya', 'Facial', 'Animation'],
                glbPath: 'models/guitar.glb', // REPLACE WITH YOUR GLB LINK
                thumbnail: 'models/thumbnails/facial_rig.jpg' // REPLACE WITH YOUR THUMBNAIL
            },
            {
                id: 'model-5',
                name: 'Vehicle Rig',
                description: 'Vehicle rig with suspension and steering controls.',
                tags: ['Maya', 'Vehicle', 'Mechanical'],
                glbPath: 'D:/Portfolio/my_Portfolio/models/gun.glb', // REPLACE WITH YOUR GLB LINK
                thumbnail: 'models/thumbnails/vehicle_rig.jpg' // REPLACE WITH YOUR THUMBNAIL
            },
            {
                id: 'model-6',
                name: 'Prop Rig',
                description: 'Various prop rigs with custom controls for animation.',
                tags: ['Maya', 'Props', 'Animation'],
                glbPath: 'D:/Portfolio/my_Portfolio/models/plane.glb', // REPLACE WITH YOUR GLB LINK
                thumbnail: 'models/thumbnails/prop_rig.jpg' // REPLACE WITH YOUR THUMBNAIL
            }
        ];

        this.currentModelIndex = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();

        this.init();
        this.loadModel(this.models[this.currentModelIndex]);
        this.setupEventListeners();
        this.createThumbnails();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('modelCanvas'),
            antialias: true 
        });
        this.renderer.setSize(document.getElementById('modelCanvas').clientWidth, document.getElementById('modelCanvas').clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        
        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        const fillLight = new THREE.DirectionalLight(0x7777ff, 0.5);
        fillLight.position.set(-1, -1, -1);
        this.scene.add(fillLight);
        
        // Add environment
        this.loadEnvironment();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    loadEnvironment() {
        const envLoader = new RGBELoader();
        envLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;
            this.scene.background = texture;
        });
    }

    loadModel(modelData) {
        // Show loading overlay
        document.getElementById('loadingOverlay').style.display = 'flex';
        
        // Remove previous model if exists
        if (this.model) {
            this.scene.remove(this.model);
        }
        
        // Load new model
        const loader = new GLTFLoader();
        loader.load(
            modelData.glbPath,
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // Set up animations if available
                if (gltf.animations && gltf.animations.length) {
                    this.mixer = new THREE.AnimationMixer(this.model);
                    const action = this.mixer.clipAction(gltf.animations[0]);
                    action.play();
                }
                
                // Center and scale model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                this.model.position.x = -center.x;
                this.model.position.y = -center.y;
                this.model.position.z = -center.z;
                
                // Adjust camera distance based on model size
                const maxDim = Math.max(size.x, size.y, size.z);
                const cameraDistance = maxDim * 1.5;
                this.camera.position.set(cameraDistance, cameraDistance, cameraDistance);
                this.controls.target.set(0, 0, 0);
                this.controls.update();
                
                // Update model info
                this.updateModelInfo(modelData);
                
                // Hide loading overlay
                document.getElementById('loadingOverlay').style.display = 'none';
            },
            (xhr) => {
                // Progress callback
                const percent = (xhr.loaded / xhr.total) * 100;
                document.getElementById('loadingText').textContent = `Loading... ${Math.round(percent)}%`;
            },
            (error) => {
                console.error('Error loading model:', error);
                document.getElementById('loadingText').textContent = 'Error loading model';
            }
        );
    }

    createThumbnails() {
        const modelList = document.querySelector('.model-list');
        modelList.innerHTML = '';
        
        this.models.forEach((model, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'model-thumbnail';
            if (index === 0) thumbnail.classList.add('active');
            thumbnail.innerHTML = `<img src="${model.thumbnail}" alt="${model.name}">`;
            thumbnail.addEventListener('click', () => {
                this.currentModelIndex = index;
                this.loadModel(model);
            });
            modelList.appendChild(thumbnail);
        });
    }

    updateModelInfo(modelData) {
        document.getElementById('modelName').textContent = modelData.name;
        document.getElementById('modelDescription').textContent = modelData.description;
        
        // Update tags
        const tagsContainer = document.getElementById('modelTags');
        tagsContainer.innerHTML = '';
        modelData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'model-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // Update active thumbnail
        document.querySelectorAll('.model-thumbnail').forEach((thumb, index) => {
            if (index === this.currentModelIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevModel').addEventListener('click', () => {
            this.currentModelIndex = (this.currentModelIndex - 1 + this.models.length) % this.models.length;
            this.loadModel(this.models[this.currentModelIndex]);
        });
        
        document.getElementById('nextModel').addEventListener('click', () => {
            this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
            this.loadModel(this.models[this.currentModelIndex]);
        });
        
        // Control buttons
        document.getElementById('rotateToggle').addEventListener('click', (e) => {
            const isActive = e.target.getAttribute('data-active') === 'true';
            e.target.setAttribute('data-active', !isActive);
            e.target.textContent = isActive ? '▶ Auto Rotate' : '⏸ Auto Rotate';
        });
        
        document.getElementById('resetView').addEventListener('click', () => {
            this.controls.reset();
        });
    }

    onWindowResize() {
        this.camera.aspect = document.getElementById('modelCanvas').clientWidth / document.getElementById('modelCanvas').clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(document.getElementById('modelCanvas').clientWidth, document.getElementById('modelCanvas').clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Auto rotate if enabled
        if (document.getElementById('rotateToggle').getAttribute('data-active') === 'true') {
            if (this.model) this.model.rotation.y += 0.005;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModelViewer();
});