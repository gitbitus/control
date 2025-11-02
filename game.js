// ======== 1. Setup scene, camera, and renderer ========
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // light blue sky

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("gameContainer").appendChild(renderer.domElement);

// ======== 2. Add lights ========
let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// ======== 3. Add ground ========
let groundGeometry = new THREE.PlaneGeometry(200, 200);
let groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // greenish
let ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ======== 4. Load Bhalu model ========
let loader = new THREE.GLTFLoader();
let bhalu;

loader.load('bhalu.glb', function (gltf) {
    bhalu = gltf.scene;
    bhalu.scale.set(30, 30, 30);
    bhalu.position.set(0, 5, 0); // Place Bhalu at the center
    bhalu.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    scene.add(bhalu);
}, undefined, error => console.error(error));

// ======== 6. Movement logic ========
let bhaluSpeed = 0;
let bhaluDirection = 0;

// Controls for Bhalu
document.addEventListener('keydown', function (event) {
    if (event.key === 'a') bhaluDirection += 0.1;
    else if (event.key === 'd') bhaluDirection -= 0.1;
    else if (event.key === 'w') bhaluSpeed = 0.2;
    else if (event.key === 's') bhaluSpeed = -0.2;
});

document.addEventListener('keyup', function (event) {
    if (['w', 's'].includes(event.key)) bhaluSpeed = 0;
});

camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

// ======== 7. Game loop ========
function animate() {
    requestAnimationFrame(animate);

    if (bhalu) {
        bhalu.rotation.y = bhaluDirection;
        bhalu.position.x += bhaluSpeed * Math.sin(bhaluDirection);
        bhalu.position.z += bhaluSpeed * Math.cos(bhaluDirection);
    }

    renderer.render(scene, camera);
}

animate();

// ======== 8. Handle window resize ========
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

