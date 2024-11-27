import * as THREE from './modules/three.module.js';

main();

function main() {
    const textureLoader = new THREE.TextureLoader();
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    // create camera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);

    // create the scene
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0.3, 0.5, 0.8);
    scene.background = new textureLoader.load("textures/star.jpg");
    const fog = new THREE.Fog("black", 1,90);
    scene.fog = fog;

    // GEOMETRY
    // create the cube
    const cubeSize = 6;
    const cubeGeometry = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );  

    // Create the Sphere
    const sphereRadius = 5;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthSegments,
        sphereHeightSegments
    );

    // Create the upright plane
    const planeWidth = 256;
    const planeHeight =  128;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );

    // MATERIALS
    const cubeTextureMap = textureLoader.load('textures/earth.jpg');
    cubeTextureMap.wrapS = THREE.RepeatWrapping;
    cubeTextureMap.wrapT = THREE.RepeatWrapping;
    
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: cubeTextureMap,  // Menggunakan tekstur 'earth.jpg' sama seperti sphere
        normalMap: cubeTextureMap // Opsional: Menggunakan tekstur yang sama untuk normal map
    });
    
    const sphereTextureMap = textureLoader.load('textures/earth.jpg');
    sphereTextureMap.wrapS = THREE.RepeatWrapping;
    sphereTextureMap.wrapT = THREE.RepeatWrapping;
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: sphereTextureMap,  // Menggunakan tekstur 'earth.jpg' tanpa warna tambahan
        normalMap: sphereTextureMap // Opsional: Menggunakan tekstur yang sama untuk normal map
    });
    
    const planeTextureMap = textureLoader.load('textures/moon.jpg');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    
    const planeNorm = textureLoader.load('textures/pebbles_normal.png');
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(16, 16);
    
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,   // Menggunakan tekstur 'moon.jpg' tanpa warna tambahan
        side: THREE.DoubleSide,
        normalMap: planeNorm
    });
    
    // MESHES
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    //scene.add(plane);

    //LIGHTS
    const color = 0xffffff;
    const intensity = .7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(0, 30, 30);
    scene.add(light);
    scene.add(light.target);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // DRAW
    function draw(time){
        time *= 0.001;

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        sphere.rotation.y += 0.01;

        light.position.x = 20*Math.cos(time);
        light.position.y = 20*Math.sin(time);
        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

// UPDATE RESIZE
function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}