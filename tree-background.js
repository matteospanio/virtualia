// Three.js background with animated tree, falling leaves, and breeze effect
(function() {
    // Check if THREE.js is available
    if (typeof THREE === 'undefined') {
        console.warn('THREE.js library not loaded. 3D background will not be displayed.');
        return;
    }
    
    let scene, camera, renderer, tree, leaves, fallingLeaves;
    let clock, animationFrameId;
    
    // Initialize Three.js scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        
        // Setup camera
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 3, 8);
        camera.lookAt(0, 3, 0);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add to DOM
        const container = document.createElement('div');
        container.id = 'three-background';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-1';
        container.style.pointerEvents = 'auto'; // Make interactive
        container.style.cursor = 'grab';
        container.appendChild(renderer.domElement);
        document.body.insertBefore(container, document.body.firstChild);
        
        // Initialize clock for animations
        clock = new THREE.Clock();
        
        // Create lights
        createLights();
        
        // Create the ancient tree
        createTree();
        
        // Create falling leaves
        createFallingLeaves();
        
        // Add interaction controls
        setupInteraction();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        
        // Update theme based on current setting
        updateTheme();
        
        // Start animation loop
        animate();
    }
    
    // Create lighting
    function createLights() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);
        
        // Soft fill light from the side
        const fillLight = new THREE.DirectionalLight(0x88ccff, 0.3);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);
    }
    
    // Create the ancient tree with thick trunk and dense crown - smaller and more realistic
    function createTree() {
        tree = new THREE.Group();
        
        // Create trunk - smaller but realistic
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 16);
        const trunkMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4a3527,
            flatShading: false,
            shininess: 5
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        tree.add(trunk);
        
        // Add bark texture variation with bumps - scaled for smaller tree
        const bumpGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const bumpMaterial = new THREE.MeshPhongMaterial({ color: 0x3d2817 });
        for (let i = 0; i < 15; i++) {
            const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 3.5 + 0.3;
            const radius = 0.3 + (4 - height) * 0.015;
            bump.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            bump.scale.set(1, 0.5, 0.8);
            tree.add(bump);
        }
        
        // Create a realistic crown with multiple layers - smaller
        leaves = new THREE.Group();
        
        // Multiple spherical layers for dense crown - scaled down
        const crownLayers = [
            { radius: 1.5, y: 3.8, color: 0x2d5016 },
            { radius: 1.7, y: 4.2, color: 0x3a6b1f },
            { radius: 1.6, y: 4.6, color: 0x4a8229 },
            { radius: 1.3, y: 5, color: 0x3a6b1f },
            { radius: 1, y: 5.3, color: 0x2d5016 }
        ];
        
        crownLayers.forEach((layer, index) => {
            const crownGeometry = new THREE.SphereGeometry(layer.radius, 16, 16);
            const crownMaterial = new THREE.MeshPhongMaterial({ 
                color: layer.color,
                flatShading: true,
                shininess: 10
            });
            const crown = new THREE.Mesh(crownGeometry, crownMaterial);
            crown.position.y = layer.y;
            crown.userData.originalY = layer.y;
            crown.userData.layer = index;
            crown.userData.phase = Math.random() * Math.PI * 2;
            leaves.add(crown);
        });
        
        // Add individual leaf clusters around the crown - smaller and more realistic
        const leafClusterGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        for (let i = 0; i < 40; i++) {
            const colors = [0x2d5016, 0x3a6b1f, 0x4a8229];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const leafMaterial = new THREE.MeshPhongMaterial({ 
                color: color,
                flatShading: true 
            });
            const leafCluster = new THREE.Mesh(leafClusterGeometry, leafMaterial);
            
            // Position clusters around the crown - scaled
            const angle = Math.random() * Math.PI * 2;
            const heightFactor = Math.random();
            const radius = 1.3 + heightFactor * 0.8;
            const y = 3.8 + heightFactor * 1.8;
            
            leafCluster.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            
            leafCluster.userData.originalPos = leafCluster.position.clone();
            leafCluster.userData.swayPhase = Math.random() * Math.PI * 2;
            leafCluster.userData.swaySpeed = 0.5 + Math.random() * 0.5;
            
            leaves.add(leafCluster);
        }
        
        tree.add(leaves);
        
        // Position tree
        tree.position.set(0, 0, 0);
        scene.add(tree);
    }
    
    // Create falling leaves
    function createFallingLeaves() {
        fallingLeaves = new THREE.Group();
        
        // Create individual falling leaves
        const leafGeometry = new THREE.PlaneGeometry(0.2, 0.3);
        const leafColors = [0xff9800, 0xffc107, 0xff5722, 0x66bb6a, 0x4caf50];
        
        for (let i = 0; i < 100; i++) {
            const color = leafColors[Math.floor(Math.random() * leafColors.length)];
            const leafMaterial = new THREE.MeshBasicMaterial({ 
                color: color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            
            // Random starting position in the crown area - adjusted for smaller tree
            leaf.position.set(
                (Math.random() - 0.5) * 6,
                3.8 + Math.random() * 3,
                (Math.random() - 0.5) * 6
            );
            
            // Store animation properties
            leaf.userData.fallSpeed = 0.01 + Math.random() * 0.02;
            leaf.userData.rotationSpeed = (Math.random() - 0.5) * 0.1;
            leaf.userData.swayAmplitude = 0.5 + Math.random() * 1;
            leaf.userData.swayPhase = Math.random() * Math.PI * 2;
            leaf.userData.swaySpeed = 0.5 + Math.random() * 1;
            leaf.userData.startY = leaf.position.y;
            
            fallingLeaves.add(leaf);
        }
        
        scene.add(fallingLeaves);
    }
    
    // Setup interaction - click to rotate tree
    function setupInteraction() {
        let isDragging = false;
        let previousMouseX = 0;
        let targetRotationY = 0;
        let currentRotationY = 0;
        
        const container = document.getElementById('three-background');
        
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMouseX = e.clientX;
            container.style.cursor = 'grabbing';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (isDragging && tree) {
                const deltaX = e.clientX - previousMouseX;
                targetRotationY += deltaX * 0.01;
                previousMouseX = e.clientX;
            }
        });
        
        container.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseleave', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });
        
        // Touch support for mobile
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMouseX = e.touches[0].clientX;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (isDragging && tree) {
                const deltaX = e.touches[0].clientX - previousMouseX;
                targetRotationY += deltaX * 0.01;
                previousMouseX = e.touches[0].clientX;
            }
        });
        
        container.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Smooth rotation animation
        function updateRotation() {
            if (tree) {
                currentRotationY += (targetRotationY - currentRotationY) * 0.1;
                tree.rotation.y = currentRotationY;
            }
            requestAnimationFrame(updateRotation);
        }
        updateRotation();
    }
    
    // Animation loop
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        const delta = clock.getDelta();
        
        // Animate tree crown with gentle breeze
        if (leaves) {
            leaves.children.forEach((child) => {
                if (child.userData.layer !== undefined) {
                    // Main crown layers - gentle breathing
                    const breathe = Math.sin(elapsedTime * 0.5 + child.userData.phase) * 0.1;
                    child.position.y = child.userData.originalY + breathe;
                } else if (child.userData.swayPhase !== undefined) {
                    // Individual leaf clusters - sway with breeze
                    const sway = Math.sin(elapsedTime * child.userData.swaySpeed + child.userData.swayPhase);
                    child.position.x = child.userData.originalPos.x + sway * 0.2;
                    child.position.z = child.userData.originalPos.z + Math.cos(elapsedTime * child.userData.swaySpeed + child.userData.swayPhase) * 0.2;
                }
            });
            
            // Gentle rotation of the whole crown
            leaves.rotation.y = Math.sin(elapsedTime * 0.2) * 0.05;
        }
        
        // Animate falling leaves
        if (fallingLeaves) {
            fallingLeaves.children.forEach((leaf) => {
                // Fall down
                leaf.position.y -= leaf.userData.fallSpeed;
                
                // Sway horizontally with breeze
                leaf.userData.swayPhase += leaf.userData.swaySpeed * delta;
                leaf.position.x += Math.sin(leaf.userData.swayPhase) * 0.01;
                leaf.position.z += Math.cos(leaf.userData.swayPhase * 0.7) * 0.01;
                
                // Rotate as it falls
                leaf.rotation.x += leaf.userData.rotationSpeed;
                leaf.rotation.y += leaf.userData.rotationSpeed * 0.5;
                leaf.rotation.z += leaf.userData.rotationSpeed * 0.3;
                
                // Reset when it falls below ground
                if (leaf.position.y < -2) {
                    leaf.position.y = leaf.userData.startY;
                    leaf.position.x = (Math.random() - 0.5) * 10;
                    leaf.position.z = (Math.random() - 0.5) * 10;
                    leaf.userData.swayPhase = Math.random() * Math.PI * 2;
                }
            });
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Update theme colors
    function updateTheme() {
        const theme = document.documentElement.getAttribute('data-bs-theme');
        
        if (theme === 'dark') {
            // Darker, more muted colors for dark theme
            scene.background = new THREE.Color(0x1a1a1a);
            scene.fog = new THREE.Fog(0x1a1a1a, 20, 50);
        } else {
            // Light, natural colors for light theme
            scene.background = new THREE.Color(0xf1f8e9);
            scene.fog = new THREE.Fog(0xf1f8e9, 20, 50);
        }
    }
    
    // Listen for theme changes
    function observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-bs-theme') {
                    updateTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-bs-theme']
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof THREE !== 'undefined') {
                init();
                observeThemeChanges();
            }
        });
    } else {
        if (typeof THREE !== 'undefined') {
            init();
            observeThemeChanges();
        }
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        if (renderer) {
            // Dispose of all geometries and materials to prevent memory leaks
            if (scene) {
                scene.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }
            renderer.dispose();
        }
    });
})();
