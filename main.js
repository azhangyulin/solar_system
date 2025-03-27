// 场景设置
const scene = new THREE.Scene();
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // 防止标签拦截事件
document.body.appendChild(labelRenderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 100);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true
});
renderer.setClearColor(0x000000, 1); // 设置黑色背景
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '1'; // 确保canvas在最上层
document.body.appendChild(renderer.domElement);

// 添加轨道控制器
// 初始化OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.enablePan = true; // 启用默认平移
controls.enableZoom = true; // 启用默认缩放
controls.rotateSpeed = 0.5;
controls.panSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.minDistance = 50;
controls.maxDistance = 200;

// 确保canvas元素可聚焦
renderer.domElement.tabIndex = 1;
renderer.domElement.style.outline = 'none';
renderer.domElement.focus();

// 添加事件监听器以确保canvas保持焦点
renderer.domElement.addEventListener('click', () => {
    renderer.domElement.focus();
});

// 添加环境光和太阳光
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// 添加太阳点光源
const sunLight = new THREE.PointLight(0xffffff, 1, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// 创建太阳
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = true;
sun.receiveShadow = true;

// 添加太阳标签
const sunLabelDiv = document.createElement('div');
sunLabelDiv.className = 'label';
sunLabelDiv.textContent = 'Sun';
const sunLabel = new THREE.CSS2DObject(sunLabelDiv);
sunLabel.position.set(0, 6, 0);
sun.add(sunLabel);
scene.add(sun);

// 行星数据
const planets = [
    { name: 'Mercury', radius: 0.4, distance: 10, color: 0x8c8c8c, speed: 0.01 },
    { name: 'Venus', radius: 0.9, distance: 15, color: 0xe6b800, speed: 0.0075 },
    { name: 'Earth', radius: 1, distance: 20, color: 0x0000ff, speed: 0.005 },
    { name: 'Mars', radius: 0.5, distance: 25, color: 0xff3300, speed: 0.004 },
    { name: 'Jupiter', radius: 2.5, distance: 35, color: 0xff9966, speed: 0.0025 },
    { name: 'Saturn', radius: 2, distance: 45, color: 0xffcc99, speed: 0.0015 },
    { name: 'Uranus', radius: 1.5, distance: 55, color: 0x66ccff, speed: 0.001 },
    { name: 'Neptune', radius: 1.5, distance: 65, color: 0x0000cc, speed: 0.0005 }
];

// 创建行星
const planetMeshes = [];
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    let material;
    if (planet.name === 'Earth') {
        const texture = new THREE.TextureLoader().load('textures/earth.jpg');
        material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: 10
        });
    } else if (planet.name === 'Jupiter') {
        const texture = new THREE.TextureLoader().load('textures/jupiter.jpg');
        material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: 10
        });
    } else {
        material = new THREE.MeshPhongMaterial({ 
            color: planet.color,
            shininess: 10
        });
    }
    const mesh = new THREE.Mesh(geometry, material);
    
    // 为土星添加环
    if (planet.name === 'Saturn') {
        const ringGeometry = new THREE.RingGeometry(3.0, 4.5, 64);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xffcc99,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            shininess: 30
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = Math.PI / 9; // 倾斜约20度
        mesh.add(ring);
    }
    
    // 创建轨道（注释掉轨道创建代码）
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000090,
        side: THREE.DoubleSide,
        transparent: false
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    // 初始化行星位置
    const angle = planets.indexOf(planet) * (Math.PI * 2 / planets.length); // 使用index获取当前行星索引
    mesh.position.x = Math.cos(angle) * planet.distance;
    mesh.position.z = Math.sin(angle) * planet.distance;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // 添加行星标签
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = planet.name;
    const label = new THREE.CSS2DObject(labelDiv);
    label.position.set(0, planet.radius + 0.5, 0);
    mesh.add(label);
    
    scene.add(mesh);
    
    // 为有卫星的行星创建卫星系统
    if (['Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(planet.name)) {
        const moonCount = {
            Earth: 1,
            Mars: 2,
            Jupiter: 4,
            Saturn: 5,
            Uranus: 3,
            Neptune: 2
        }[planet.name];
        
        for (let i = 0; i < moonCount; i++) {
            const moonRadius = planet.radius * 0.2;
            const moonDistance = planet.radius * 2 + i * 1.5;
            const moonSpeed = planet.speed * 5 + Math.random() * 0.01;
            
            // 创建卫星
            const moonGeometry = new THREE.SphereGeometry(moonRadius, 16, 16);
            const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            
            // 创建卫星轨道（注释掉轨道创建代码）
            // const moonOrbitGeometry = new THREE.RingGeometry(moonDistance - 0.05, moonDistance + 0.05, 32);
            // const moonOrbitMaterial = new THREE.MeshBasicMaterial({
            //     color: 0x666666,
            //     side: THREE.DoubleSide,
            //     transparent: false
            // });
            // const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
            // moonOrbit.rotation.x = Math.PI / 2;
            // scene.add(moonOrbit);
            
            // 初始化卫星位置
            const moonAngle = i * (Math.PI * 2 / moonCount); // 使用循环变量i计算卫星角度
            moon.position.x = mesh.position.x + Math.cos(moonAngle) * moonDistance;
            moon.position.z = mesh.position.z + Math.sin(moonAngle) * moonDistance;
            moon.castShadow = true;
            moon.receiveShadow = true;
            scene.add(moon);
            
            planetMeshes.push({
                mesh: moon,
                speed: moonSpeed,
                distance: moonDistance,
                angle: moonAngle,
                parent: mesh
            });
        }
    }
    
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

// 创建星空背景
const starCount = 5000;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);
const starColors = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    // 随机球面坐标
    const radius = 800 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    // 转换为笛卡尔坐标
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
    
    // 随机大小(0.1-0.5)
    starSizes[i] = 0.1 + Math.random() * 0.4;
    
    // 随机颜色(更亮的白色或淡蓝色)
    const isBlue = Math.random() > 0.7;
    starColors[i * 3] = isBlue ? 0.8 + Math.random() * 0.2 : 1.0;
    starColors[i * 3 + 1] = isBlue ? 0.9 + Math.random() * 0.1 : 1.0;
    starColors[i * 3 + 2] = 1.0;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starsMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,  // 提高透明度使星星更亮
    sizeAttenuation: true
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新行星和卫星位置
    planetMeshes.forEach(planet => {
        planet.angle += planet.speed;
        
        if (planet.parent) {
            // 处理卫星运动
            planet.mesh.position.x = planet.parent.position.x + Math.cos(planet.angle) * planet.distance;
            planet.mesh.position.z = planet.parent.position.z + Math.sin(planet.angle) * planet.distance;
        } else {
            // 处理行星运动
            planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        }
    });

    // 更新控制器
    controls.update();
    
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// 处理窗口大小调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
});

animate();
