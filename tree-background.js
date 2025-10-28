// Three.js background with animated tree, falling leaves, and breeze effect
(function() {
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
        camera.position.set(0, 5, 15);
        camera.lookAt(0, 5, 0);
        
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
        container.style.pointerEvents = 'none';
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
    
    // Create the ancient tree with thick trunk and dense crown
    function createTree() {
        tree = new THREE.Group();
        
        // Create trunk - thick and tall for an old tree
        const trunkGeometry = new THREE.CylinderGeometry(0.6, 0.8, 8, 12);
        const trunkMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x5d4037,
            flatShading: false,
            shininess: 5
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 4;
        tree.add(trunk);
        
        // Add bark texture variation with bumps
        const bumpGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const bumpMaterial = new THREE.MeshPhongMaterial({ color: 0x4a3527 });
        for (let i = 0; i < 20; i++) {
            const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 7 + 0.5;
            const radius = 0.6 + (8 - height) * 0.025;
            bump.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            bump.scale.set(1, 0.5, 0.8);
            tree.add(bump);
        }
        
        // Create a large, thick crown with multiple layers
        leaves = new THREE.Group();
        
        // Multiple spherical layers for dense crown
        const crownLayers = [
            { radius: 3.5, y: 8, color: 0x4caf50 },
            { radius: 4, y: 9, color: 0x66bb6a },
            { radius: 3.8, y: 10, color: 0x81c784 },
            { radius: 3.2, y: 11, color: 0x66bb6a },
            { radius: 2.5, y: 12, color: 0x4caf50 }
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
        
        // Add individual leaf clusters around the crown
        const leafClusterGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        for (let i = 0; i < 50; i++) {
            const colors = [0x4caf50, 0x66bb6a, 0x81c784];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const leafMaterial = new THREE.MeshPhongMaterial({ 
                color: color,
                flatShading: true 
            });
            const leafCluster = new THREE.Mesh(leafClusterGeometry, leafMaterial);
            
            // Position clusters around the crown
            const angle = Math.random() * Math.PI * 2;
            const heightFactor = Math.random();
            const radius = 3 + heightFactor * 1.5;
            const y = 8 + heightFactor * 4;
            
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
            
            // Random starting position in the crown area
            leaf.position.set(
                (Math.random() - 0.5) * 10,
                8 + Math.random() * 6,
                (Math.random() - 0.5) * 10
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
            init();
            observeThemeChanges();
        });
    } else {
        init();
        observeThemeChanges();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        if (renderer) {
            renderer.dispose();
        }
    });
})();
