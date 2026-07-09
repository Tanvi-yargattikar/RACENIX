import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';

export const initCarAnimation = () => {
    const canvas = document.getElementById('scrolly-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 1.5, 8);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Lighting - Initialized at 0 for "Fade in from darkness"
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const redLight = new THREE.PointLight(0xe10600, 0, 20);
    redLight.position.set(-2, 2, 2);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x00D2FF, 0, 20);
    blueLight.position.set(2, -2, -2);
    scene.add(blueLight);

    // Ground reflection / glow
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.9,
        roughness: 0.4,
        transparent: true,
        opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);

    // Car Group
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Load Realistic F1 Car
    const loader = new GLTFLoader();
    const MODEL_PATH = './assets/f1_car.glb'; // Expected path for realistic model

    loader.load(
        MODEL_PATH,
        (gltf) => {
            const carModel = gltf.scene;
            
            // Apply metallic adjustments if desired
            carModel.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.envMapIntensity = 2.0;
                    child.material.needsUpdate = true;
                    // Optional: force shadows or materials
                }
            });

            // Scale and position adjustment (Generic handling)
            // A typical model might need scaling, we'll try to normalize it roughly
            const box = new THREE.Box3().setFromObject(carModel);
            const size = box.getSize(new THREE.Vector3()).length();
            const center = box.getCenter(new THREE.Vector3());
            
            // Normalize scale to ~5 units long
            const scale = 5 / size;
            carModel.scale.set(scale, scale, scale);
            
            // Center model
            carModel.position.x += (carModel.position.x - center.x) * scale;
            carModel.position.y += (carModel.position.y - center.y) * scale;
            carModel.position.z += (carModel.position.z - center.z) * scale;

            // Rest position inside group
            carModel.position.y += 0.5; // sit on ground
            carGroup.add(carModel);
        },
        undefined,
        (error) => {
            console.error('Realistic F1 model not found at', MODEL_PATH, '. Please drop a high-quality .glb model in the assets directory.');
            // No procedural shapes fallback per user instruction.
        }
    );

    // Car starts slightly right and angled
    carGroup.position.set(1.5, 0, 0); 
    carGroup.rotation.y = Math.PI / 8;

    // Track Lines
    const trackGroup = new THREE.Group();
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xe10600, transparent: true, opacity: 0 });
    for(let i=0; i<40; i++) {
        const lineGeo = new THREE.BoxGeometry(0.05, 0.01, Math.random() * 5 + 2);
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set(
            (Math.random()-0.5)*20, 
            -0.49, 
            (Math.random()-0.5)*40
        );
        trackGroup.add(line);
    }
    scene.add(trackGroup);

    // Animation state
    const state = {
        speed: 0,
        lightStreakOp: 0
    };

    // SETUP GSAP Scrollytelling Timeline
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".scrolly-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // SECTION 1 to 2: Fade from Darkness (Reveal)
        tl.to(ambientLight, { intensity: 0.5, duration: 2 }, 0);
        tl.to(dirLight, { intensity: 2.0, duration: 2 }, 0);
        tl.to(redLight, { intensity: 100, duration: 2 }, 0);
        tl.to(blueLight, { intensity: 80, duration: 2 }, 0);
        
        // SECTION 2 to 3: Mid Scroll (Parallax / Move Forward)
        tl.to(carGroup.position, { z: 2, x: 0, duration: 3, ease: "power1.inOut" }, 2);
        tl.to(carGroup.rotation, { y: -Math.PI / 12, duration: 3, ease: "power1.inOut" }, 2);
        tl.to(camera.position, { x: -2, z: 6, duration: 3, ease: "power1.inOut" }, 2);

        // SECTION 3 to 4: Motion Velocity (Speed tracking)
        tl.to(state, { speed: 1, duration: 2 }, 5);
        tl.to(lineMat, { opacity: 0.8, duration: 2 }, 5);
        tl.to(carGroup.position, { z: 4, duration: 2 }, 5);
        tl.to(camera.position, { z: 4, y: 1, duration: 2 }, 5);
    }

    // Render Loop
    const clock = new THREE.Clock();
    let wheelAngle = 0;

    const animateLoop = () => {
        requestAnimationFrame(animateLoop);
        const delta = clock.getDelta();

        // Subtle continuous bobbing
        carGroup.position.y = Math.sin(clock.elapsedTime * 2) * 0.03;

        // Velocity State (Section 4)
        if (state.speed > 0) {
            trackGroup.children.forEach(line => {
                line.position.z += delta * (80 * state.speed);
                if(line.position.z > 20) {
                    line.position.z = -40;
                    line.position.x = (Math.random()-0.5)*20;
                }
            });
            
            // Subtle camera shake at high speed
            camera.position.y += (Math.random() - 0.5) * 0.03 * state.speed;
        }

        camera.lookAt(scene.position);

        // Mobile scaling down
        if (window.innerWidth < 768) {
            carGroup.scale.set(0.6, 0.6, 0.6);
            carGroup.position.x = 0;
            camera.position.z = 12;
        } else {
            carGroup.scale.set(1, 1, 1);
        }

        renderer.render(scene, camera);
    };

    animateLoop();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};
