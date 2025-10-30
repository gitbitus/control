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

// ======== 4. Load car models ========
let loader = new THREE.GLTFLoader();
let car1, car2;

loader.load('assets/car1_model.glb', function (gltf) {
    car1 = gltf.scene;
    car1.scale.set(30,30,30);
    car1.position.set(-5, 5, 0);
    car1.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    scene.add(car1);
}, undefined, error => console.error(error));

loader.load('assets/dino.glb', function (gltf) {
    dino = gltf.scene;
    dino.scale.set(50,50,50);
    dino.position.set(-5, 5, 0);
    dino.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    scene.add(dino);
}, undefined, error => console.error(error));

loader.load('assets/car2_model.glb', function (gltf) {
    car2 = gltf.scene;
    car2.scale.set(0.5, 0.5, 0.5);
    car2.position.set(5, 0, 0);
    car2.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    scene.add(car2);
}, undefined, error => console.error(error));
loader.load('assets/bhalu.glb', function (gltf) {
    bhalu = gltf.scene;
    bhalu.scale.set(30,30,30);
    bhalu.position.set(5, 10, 0);
    bhalu.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    scene.add(bhalu);
}, undefined, error => console.error(error));




// ======== 6. Movement logic ========
let player1Speed = 0;
let player2Speed = 0;
let player1Direction = 0;
let player2Direction = 0;


// Player 1: W A S D
document.addEventListener('keydown', function (event) {
    if (event.key === 'a') player1Direction += 0.1;
    else if (event.key === 'd') player1Direction -= 0.1;
    else if (event.key === 'w') player1Speed = 0.2;
    else if (event.key === 's') player1Speed = -0.2;
});

document.addEventListener('keyup', function (event) {
    if (['w', 's'].includes(event.key)) player1Speed = 0;
});


// Player 2: Arrow keys
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') player2Direction += 0.1;
    else if (event.key === 'ArrowRight') player2Direction -= 0.1;
    else if (event.key === 'ArrowUp') player2Speed = 0.2;
    else if (event.key === 'ArrowDown') player2Speed = -0.2;
});

document.addEventListener('keyup', function (event) {
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) player2Speed = 0;
});
camera.position.set(20,20,0);
camera.lookAt(0,0,0);

// ======== 7. Game loop ========
function animate() {
    requestAnimationFrame(animate);

    if (bhalu) {
        bhalu.rotation.y = player1Direction;
        bhalu.position.x += player1Speed * Math.sin(player1Direction);
        bhalu.position.z += player1Speed * Math.cos(player1Direction);
        // camera.position.y=20;
        // camera.position.x=(bhalu.position.x)-5*Math.cos(player1Direction);
        // camera.position.z=bhalu.position.x-5*Math.sin(player1Direction)
        // camera.lookAt(bhalu.position.x,10, (bhalu.position.z));
    }

    if (dino) {
        dino.rotation.y = player2Direction;
        dino.position.x += player2Speed * Math.cos(player2Direction);
        dino.position.z += player2Speed * Math.sin(player2Direction);
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
