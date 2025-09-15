function openInNewTab(url) {
    window.open(url, '_blank').focus();
}

document.addEventListener('DOMContentLoaded', () => {
    // Portal Animation Logic using Three.js
    const portalLanding = document.getElementById('portal-landing');
    const mainPortfolio = document.getElementById('main-portfolio');
    const canvasPortal = document.getElementById('portal-canvas');

    const scenePortal = new THREE.Scene();
    const cameraPortal = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const rendererPortal = new THREE.WebGLRenderer({ canvas: canvasPortal, alpha: true });
    rendererPortal.setSize(window.innerWidth, window.innerHeight);
    cameraPortal.position.z = 5;

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffd700,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scenePortal.add(particlesMesh);

    function animatePortal() {
        requestAnimationFrame(animatePortal);
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0008;
        rendererPortal.render(scenePortal, cameraPortal);
    }
    animatePortal();

    window.addEventListener('resize', () => {
        cameraPortal.aspect = window.innerWidth / window.innerHeight;
        cameraPortal.updateProjectionMatrix();
        rendererPortal.setSize(window.innerWidth, window.innerHeight);
    });

    // After mainPortfolio is shown, initialize S animation
    setTimeout(() => {
        portalLanding.style.opacity = '0';
        setTimeout(() => {
            portalLanding.style.display = 'none';
            mainPortfolio.classList.remove('hidden');
            if (typeof initPhotoAnimation === "function") {
                initPhotoAnimation();
            }
            if (typeof initSAnimation === "function") {
                initSAnimation(); // <-- Add this line
            }
        }, 500); // Wait for the fade-out to complete (faster)
    }, 1000); // 1-second delay

    // Intersection Observer to trigger fade-in animations for main content
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the section is visible

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Navigation bar scroll behavior
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Contact form pop-up functionality
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('thankYouModal');
    const closeBtn = document.querySelector('.modal-close-button');

    // Only add event listeners if form and modal exist
    if (form && modal) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    modal.style.display = 'flex';
                    form.reset(); // Clear the form
                } else {
                    console.error('Form submission failed.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = 'SEND';
                    submitBtn.disabled = false;
                }
            }
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });


    }
});

// 3D Animation around the photo
function initPhotoAnimation() {
    const photoCanvas = document.getElementById('photo-canvas');
    const photoContainer = document.querySelector('.photo-container');

    if (!photoCanvas || !photoContainer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, photoContainer.clientWidth / photoContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: photoCanvas, alpha: true });
    renderer.setSize(photoContainer.clientWidth, photoContainer.clientHeight);

    const geometry = new THREE.TorusGeometry(1.5, 0.3, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.5 });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    camera.position.z = 3;

    const photoGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const photoMaterial = new THREE.MeshBasicMaterial({ color: 0xfff, transparent: true, opacity: 0.1 });
    const photoSphere = new THREE.Mesh(photoGeometry, photoMaterial);
    scene.add(photoSphere);


    function animatePhoto() {
        requestAnimationFrame(animatePhoto);
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animatePhoto();

    window.addEventListener('resize', () => {
        const newWidth = photoContainer.clientWidth;
        const newHeight = photoContainer.clientHeight;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
    });
}

// New S-type background animation using Three.js
function initSAnimation() {
    const sCanvas = document.getElementById('animated-background-canvas');
    if (!sCanvas) return;

    const parent = sCanvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, parent.clientWidth / parent.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: sCanvas, alpha: true, antialias: true });
    renderer.setSize(parent.clientWidth, parent.clientHeight);

    // Create the S-shape geometry
    const points = [];
    for (let i = 0; i < 50; i++) {
        const x = Math.sin(i * 0.1) * 3;
        const y = -i * 0.2;
        const z = Math.cos(i * 0.1) * 3;
        points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);

    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.5, 8, false);
    const material = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.1
    });
    const sMesh = new THREE.Mesh(tubeGeometry, material);
    sMesh.rotation.z = Math.PI / 2;
    scene.add(sMesh);

    const sMesh2 = new THREE.Mesh(tubeGeometry, material);
    sMesh2.position.x = 8;
    sMesh2.position.z = -5;
    sMesh2.rotation.z = -Math.PI / 2;
    scene.add(sMesh2);

    // Add lights to make the material visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 15;
    camera.position.y = 0;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animateS() {
        requestAnimationFrame(animateS);

        // Simple animation for the shapes
        const time = Date.now() * 0.0005;
        sMesh.rotation.y = time * 0.5;
        sMesh2.rotation.y = -time * 0.5;

        // Update camera position based on mouse movement
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animateS();

    window.addEventListener('resize', () => {
        const newWidth = parent.clientWidth;
        const newHeight = parent.clientHeight;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
    });
}

