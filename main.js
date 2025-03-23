// 场景设置
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 150);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加轨道控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// 添加环境光和太阳光
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// 添加太阳点光源
const sunLight = new THREE.PointLight(0xffffff, 1, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// 创建太阳
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = true;
sun.receiveShadow = true;
scene.add(sun);

// 行星数据
const planets = [
    { name: 'Mercury', radius: 0.4, distance: 10, color: 0x8c8c8c, speed: 0.02 },
    { name: 'Venus', radius: 0.9, distance: 15, color: 0xe6b800, speed: 0.015 },
    { name: 'Earth', radius: 1, distance: 20, color: 0x0000ff, speed: 0.01 },
    { name: 'Mars', radius: 0.5, distance: 25, color: 0xff3300, speed: 0.008 },
    { name: 'Jupiter', radius: 2.5, distance: 35, color: 0xff9966, speed: 0.005 },
    { name: 'Saturn', radius: 2, distance: 45, color: 0xffcc99, speed: 0.003 },
    { name: 'Uranus', radius: 1.5, distance: 55, color: 0x66ccff, speed: 0.002 },
    { name: 'Neptune', radius: 1.5, distance: 65, color: 0x0000cc, speed: 0.001 }
];

// 创建行星
const planetMeshes = [];
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: planet.color,
        shininess: 10
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // 创建轨道
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.3 
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    // 初始化行星位置
    const angle = Math.random() * Math.PI * 2;
    mesh.position.x = Math.cos(angle) * planet.distance;
    mesh.position.z = Math.sin(angle) * planet.distance;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    planetMeshes.push({ 
        mesh, 
        speed: planet.speed,
        distance: planet.distance,
        angle: angle
    });
});

// 启用阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新行星位置
    planetMeshes.forEach(planet => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
    });

    // 更新控制器
    controls.update();
    
    renderer.render(scene, camera);
}

// 处理窗口大小调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
});

animate();
