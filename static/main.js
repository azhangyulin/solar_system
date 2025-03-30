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

// 保存原始光源，以便在行星缩小时恢复
const originalLights = [ambientLight, sunLight];

// 创建太阳
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunTexture = new THREE.TextureLoader().load('/static/textures/sun.jpg');
const sunMaterial = new THREE.MeshPhongMaterial({
    map: sunTexture,
    shininess: 10,
    emissive: 0xffff00,
    emissiveIntensity: 0.5
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
// 存储轨道对象
const orbitObjects = [];

planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    let material;
    if (planet.name === 'Earth') {
        const texture = new THREE.TextureLoader().load('/static/textures/earth.jpg');
        material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10,
            transparent: true
        });
    } else if (planet.name === 'Jupiter') {
        const texture = new THREE.TextureLoader().load('/static/textures/jupiter.jpg');
        material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10,
            transparent: true
        });
    } else if (planet.name === 'Saturn') {
        const texture = new THREE.TextureLoader().load('/static/textures/Saturn.jpg');
        material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10,
            transparent: true
        });
    } else if (planet.name === 'Mars') {
        const texture = new THREE.TextureLoader().load('/static/textures/Mars.jpg');
        material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10,
            transparent: true
        });
    } else if (planet.name === 'Venus') {
        const texture = new THREE.TextureLoader().load('/static/textures/Venus.jpg');
        material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10,
            transparent: true
        });
    } else if (planet.name === 'Uranus') {
        const texture = new THREE.TextureLoader().load('/static/textures/Uranus.jpg');
        material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10,
            transparent: true
        });
    } else if (planet.name === 'Neptune') {
        const texture = new THREE.TextureLoader().load('/static/textures/Neptune.jpg');
        material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10,
            transparent: true
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

    // 创建轨道
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x000090,
        side: THREE.DoubleSide,
        transparent: true
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    orbit.userData.isOrbit = true;
    orbit.userData.originalOpacity = orbitMaterial.opacity;
    scene.add(orbit);
    orbitObjects.push(orbit); // 将轨道对象存储到专门的数组中

    // 初始化行星位置
    const angle = planets.indexOf(planet) * (Math.PI * 2 / planets.length);
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
            const moonRadius = planet.radius * 0.18;
            const moonDistance = planet.radius * 2 + i * 0.6;
            const moonSpeed = planet.speed * 5 + Math.random() * 0.01;

            // 创建卫星
            const moonGeometry = new THREE.SphereGeometry(moonRadius, 16, 16);
            const moonMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xaaaaaa,
                transparent: true,
                opacity: 1.0
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.userData.originalOpacity = 1.0;

            // 初始化卫星位置
            const moonAngle = i * (Math.PI * 2 / moonCount);
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
        angle: angle,
        rotationSpeed: planet.speed * 10 // 自转速度比公转快10倍
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

// 动画状态
let isAnimating = false;
let isSunExpanded = false;
// 保存初始位置和状态
const originalPositions = new Map();

// 设置raycaster用于点击检测
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 收集所有需要淡入淡出的对象(包括太阳、行星、卫星和标签)
const fadeObjects = [];
scene.traverse(object => {
    // 收集所有3D对象(太阳、行星、卫星)
    if (object instanceof THREE.Mesh) {
        // 确保材质存在且可设置透明度
        if (object.material) {
            // 记录原始透明度
            object.userData.originalOpacity = object.material.opacity;
            // 强制启用透明
            object.material.transparent = true;
        }
        fadeObjects.push(object);
    }
    // 收集所有标签
    else if (object instanceof THREE.CSS2DObject) {
        object.userData.originalOpacity = parseFloat(object.element.style.opacity) || 1;
        fadeObjects.push(object);
    }
});

// 添加点击事件监听
renderer.domElement.addEventListener('click', (event) => {
    if (isAnimating) return;
    
    // 计算鼠标位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 更新raycaster并增加检测半径
    raycaster.setFromCamera(mouse, camera);
    // 检测太阳和所有行星
    const intersects = raycaster.intersectObjects(scene.children, true);
    // 过滤出太阳或行星
    const filteredIntersects = intersects.filter(obj => {
        return obj.object === sun || 
               planetMeshes.some(p => p.mesh === obj.object);
    });
    
    if (filteredIntersects.length > 0) {
        const clickedObj = filteredIntersects[0].object;
        isAnimating = true;
        
        // 确定点击的是太阳还是行星
        const isSunClicked = clickedObj === sun;
        const isPlanetClicked = planetMeshes.some(p => p.mesh === clickedObj);
        
        if (isSunClicked && !isSunExpanded) {
            // 太阳放大动画
            gsap.to(sun.scale, {
                x: 6.5,
                y: 6.5,
                z: 6.5,
                duration: 1,
                ease: "power2.inOut"
            });
            
            // 所有相关对象淡出动画
            fadeObjects.forEach(obj => {
                if (obj !== sun && obj.material) {
                    gsap.to(obj.material, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                        onComplete: function() {
                            // 完全隐藏物体，而不仅仅是透明
                            obj.visible = false;
                        }
                    });
                }
                if (obj instanceof THREE.CSS2DObject && obj !== sunLabel) {
                    gsap.to(obj.element.style, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                        onComplete: function() {
                            obj.visible = false;
                        }
                    });
                }
            });
            
            isSunExpanded = true;
        } else if (isPlanetClicked) {
            const clickedPlanet = planetMeshes.find(p => p.mesh === clickedObj);
            if (clickedPlanet) {
                if (!clickedPlanet.isSelected) {
                    // 第一次点击 - 进入选中状态
                    clickedPlanet.isSelected = true;
                    clickedPlanet.mesh.userData.isSelected = true; // 在mesh上也标记选中状态
                    
                    // 保存初始位置和公转信息
                    if (!originalPositions.has(clickedPlanet)) {
                        originalPositions.set(clickedPlanet, {
                            position: clickedPlanet.mesh.position.clone(),
                            speed: clickedPlanet.speed,
                            distance: clickedPlanet.distance
                        });
                    }
                    
                    // 停止公转但保持自转
                    clickedPlanet.originalSpeed = clickedPlanet.speed;
                    clickedPlanet.speed = 0;
                    
                    // 找到该行星的所有卫星
                    const moons = planetMeshes.filter(p => p.parent === clickedPlanet.mesh);
                    
                    // 保存卫星的初始状态
                    moons.forEach(moon => {
                        if (!originalPositions.has(moon)) {
                            originalPositions.set(moon, {
                                position: moon.mesh.position.clone(),
                                distance: moon.distance
                            });
                        }
                    });
                    
                    // 移除原有光源
                    originalLights.forEach(light => {
                        scene.remove(light);
                    });
                    
                    // 为选中的行星添加新的聚光灯
                    const planetSpotLight = new THREE.SpotLight(0xffffff, 1.5);
                    planetSpotLight.position.set(-30, 15, 30);
                    planetSpotLight.target = clickedPlanet.mesh;
                    planetSpotLight.angle = Math.PI / 6;
                    planetSpotLight.penumbra = 0.2;
                    planetSpotLight.decay = 1;
                    planetSpotLight.distance = 200;
                    scene.add(planetSpotLight);
                    
                    // 添加微弱的环境光以避免完全黑暗
                    const dimAmbientLight = new THREE.AmbientLight(0x202020, 0.5);
                    scene.add(dimAmbientLight);
                    
                    // 保存新添加的光源
                    clickedPlanet.customLights = [planetSpotLight, dimAmbientLight];
                    
                    // 放大行星
                    // 如果是土星，稍微放大一些以便更好地显示土星环
                    const scaleAmount = clickedPlanet.mesh.children.length > 0 && clickedPlanet.mesh.children[0] instanceof THREE.Mesh ? 4.5 : 3.5;
                    gsap.to(clickedPlanet.mesh.scale, {
                        x: scaleAmount,
                        y: scaleAmount,
                        z: scaleAmount,
                        duration: 1,
                        ease: "power2.inOut"
                    });
                    
                    // 移动行星到屏幕左侧中间位置
                    gsap.to(clickedPlanet.mesh.position, {
                        x: -20,  // 移动到左侧中间
                        y: 0,    // 保持y坐标不变
                        z: 0,    // 移到z=0的位置使其正对相机
                        duration: 1.5,
                        ease: "power2.inOut",
                        onUpdate: function() {
                            // 在动画过程中同步更新所有卫星位置
                            moons.forEach(moon => {
                                // 保持卫星与行星的相对位置关系
                                moon.mesh.position.x = clickedPlanet.mesh.position.x + Math.cos(moon.angle) * moon.distance;
                                moon.mesh.position.z = clickedPlanet.mesh.position.z + Math.sin(moon.angle) * moon.distance;
                            });
                        }
                    });
                    
                    // 特别处理轨道，确保它们完全不可见
                    orbitObjects.forEach(orbit => {
                        // 先淡出再隐藏
                        gsap.to(orbit.material, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.inOut",
                            onComplete: function() {
                                orbit.visible = false; // 彻底隐藏轨道
                            }
                        });
                    });
                    
                    // 淡出其他所有物体(包括太阳、行星、卫星和标签)，但保留选中行星及其卫星和土星环
                    fadeObjects.forEach(obj => {
                        // 跳过被点击行星及其所有子对象(包括标签和土星环)
                        if (obj === clickedPlanet.mesh || 
                           clickedPlanet.mesh.children.includes(obj)) {
                            return;
                        }
                        
                        // 跳过该行星的卫星及其标签
                        let isMoon = false;
                        for (const moon of moons) {
                            if (obj === moon.mesh || 
                                (obj instanceof THREE.CSS2DObject && moon.mesh.children.includes(obj))) {
                                isMoon = true;
                                break;
                            }
                        }
                        if (isMoon) return;
                        
                        // 处理3D对象材质
                        if (obj.material) {
                            gsap.to(obj.material, {
                                opacity: 0,
                                duration: 0.5,
                                ease: "power2.inOut",
                                onComplete: function() {
                                    // 完全隐藏物体，而不仅仅是透明
                                    obj.visible = false;
                                }
                            });
                        }
                        // 处理标签
                        if (obj instanceof THREE.CSS2DObject) {
                            gsap.to(obj.element.style, {
                                opacity: 0,
                                duration: 0.5,
                                ease: "power2.inOut",
                                onComplete: function() {
                                    obj.visible = false;
                                }
                            });
                        }
                    });
                    
                    // 更新相机位置以更好地观察行星
                    gsap.to(camera.position, {
                        x: -10,
                        y: 10,
                        z: 30,
                        duration: 1.5,
                        ease: "power2.inOut",
                        onUpdate: function() {
                            camera.lookAt(clickedPlanet.mesh.position);
                        }
                    });
                    
                    // 禁用轨道控制器
                    controls.enabled = false;
                    
                } else {
                    // 第二次点击 - 恢复初始状态
                    clickedPlanet.isSelected = false;
                    clickedPlanet.mesh.userData.isSelected = false; // 清除mesh上的选中状态
                    
                    // 找到该行星的所有卫星
                    const moons = planetMeshes.filter(p => p.parent === clickedPlanet.mesh);
                    
                    // 从fadeObjects中临时移除卫星，避免它们被淡入淡出处理
                    const moonMeshes = moons.map(moon => moon.mesh);
                    const moonObjectsToRemove = fadeObjects.filter(obj => 
                        moonMeshes.includes(obj) || 
                        moonMeshes.some(moon => moon.children.includes(obj))
                    );
                    const tempFadeObjects = fadeObjects.filter(obj => !moonObjectsToRemove.includes(obj));
                    
                    // 恢复行星原始公转信息
                    const originalData = originalPositions.get(clickedPlanet);
                    if (originalData) {
                        clickedPlanet.speed = originalData.speed;
                        clickedPlanet.distance = originalData.distance;
                        
                        // 计算行星的目标位置
                        const targetX = Math.cos(clickedPlanet.angle) * clickedPlanet.distance;
                        const targetZ = Math.sin(clickedPlanet.angle) * clickedPlanet.distance;
                        
                        // 恢复行星位置
                        gsap.to(clickedPlanet.mesh.position, {
                            x: targetX,
                            y: 0,
                            z: targetZ,
                            duration: 0.01,
                            ease: "power2.inOut",
                            onUpdate: function() {
                                // 在动画过程中同步更新所有卫星位置
                                moons.forEach(moon => {
                                    // 保持卫星与行星的相对位置关系
                                    moon.mesh.position.x = clickedPlanet.mesh.position.x + Math.cos(moon.angle) * moon.distance;
                                    moon.mesh.position.z = clickedPlanet.mesh.position.z + Math.sin(moon.angle) * moon.distance;
                                });
                            }
                        });
                    }
                    
                    // 恢复行星大小
                    gsap.to(clickedPlanet.mesh.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 1,
                        ease: "power2.inOut"
                    });
                    
                    // 移除自定义光源
                    if (clickedPlanet.customLights) {
                        clickedPlanet.customLights.forEach(light => {
                            scene.remove(light);
                        });
                        clickedPlanet.customLights = null;
                    }
                    
                    // 恢复原始光源
                    originalLights.forEach(light => {
                        scene.add(light);
                    });
                    
                    // 恢复相机位置
                    gsap.to(camera.position, {
                        x: 0,
                        y: 30,
                        z: 100,
                        duration: 1.5,
                        ease: "power2.inOut",
                        onUpdate: function() {
                            camera.lookAt(0, 0, 0);
                        },
                        onComplete: function() {
                            // 重新启用轨道控制器
                            controls.enabled = true;
                        }
                    });
                    
                    // 特别处理轨道，确保它们恢复可见
                    orbitObjects.forEach(orbit => {
                        orbit.visible = true; // 先恢复可见性
                        gsap.to(orbit.material, {
                            opacity: orbit.userData.originalOpacity || 1,
                            duration: 1,
                            ease: "power2.inOut"
                        });
                    });
                    
                    // 只对非卫星物体进行淡入处理
                    tempFadeObjects.forEach(obj => {
                        // 先恢复可见性
                        obj.visible = true;
                        
                        if (obj.material) {
                            gsap.to(obj.material, {
                                opacity: obj.userData.originalOpacity || 1,
                                duration: 1,
                                ease: "power2.inOut"
                            });
                        }
                        if (obj instanceof THREE.CSS2DObject) {
                            gsap.to(obj.element.style, {
                                opacity: 1,
                                duration: 1,
                                ease: "power2.inOut"
                            });
                        }
                    });
                }
            }
        } else {
            // 恢复动画
            gsap.to(sun.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 1,
                ease: "power2.inOut"
            });
            
            // 如果太阳放大时添加了自定义光源，移除它们
            if (sun.userData.customLights) {
                sun.userData.customLights.forEach(light => {
                    scene.remove(light);
                });
                sun.userData.customLights = null;
            }
            
            // 恢复原始光源
            originalLights.forEach(light => {
                scene.add(light);
            });
            
            // 所有相关对象淡入动画
            fadeObjects.forEach(obj => {
                // 先恢复可见性
                obj.visible = true;
                
                if (obj !== sun && obj.material) {
                    gsap.to(obj.material, {
                        opacity: obj.userData.originalOpacity || 1,
                        duration: 1,
                        ease: "power2.inOut"
                    });
                }
                if (obj instanceof THREE.CSS2DObject) {
                    gsap.to(obj.element.style, {
                        opacity: 1,
                        duration: 1,
                        ease: "power2.inOut"
                    });
                }
            });
            
            isSunExpanded = false;
        }
        
        // 动画完成后重置状态
        setTimeout(() => {
            isAnimating = false;
        }, 1500);
    }
});

// 动画循环
function animate() {
    requestAnimationFrame(animate);

    // 更新太阳自转
    sun.rotation.y += 0.001; 

    // 更新行星和卫星位置
    planetMeshes.forEach(planet => {
        planet.angle += planet.speed;

        if (planet.parent) {
            // 处理卫星运动
            if (planet.parent.userData.isSelected) {
                // 如果父行星被选中，卫星应围绕新位置旋转
                planet.mesh.position.x = planet.parent.position.x + Math.cos(planet.angle) * planet.distance;
                planet.mesh.position.z = planet.parent.position.z + Math.sin(planet.angle) * planet.distance;
            } else {
                // 正常卫星运动
                planet.mesh.position.x = planet.parent.position.x + Math.cos(planet.angle) * planet.distance;
                planet.mesh.position.z = planet.parent.position.z + Math.sin(planet.angle) * planet.distance;
            }
        } else if (!planet.isSelected) {
            // 处理未被选中的行星运动
            planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        }
        
        // 添加行星自转(无论是否被选中)
        if (planet.rotationSpeed) {
            planet.mesh.rotation.y += planet.rotationSpeed;
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
