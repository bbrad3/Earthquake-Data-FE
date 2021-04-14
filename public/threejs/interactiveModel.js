import { DATA } from '../../app.js'

let localQuakes = []
// ------ Marker object ------------------------------------------------

function Marker() {
    THREE.Object3D.call(this);

    var radius = 0.005;
    var sphereRadius = 0.015;
    var height = 0.01;

    var material = new THREE.MeshPhongMaterial({ color: 0xfe05050 });

    var cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
    cone.position.y = height * 0.5;
    cone.rotation.x = Math.PI;

    var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
    sphere.position.y = height * 0.95 + sphereRadius;

    this.add(cone, sphere);
}

Marker.prototype = Object.create(THREE.Object3D.prototype);

// ------ Earth object -------------------------------------------------

function Earth(radius, texture) {
    THREE.Object3D.call(this);

    this.userData.radius = radius;

    var earth = new THREE.Mesh(
        new THREE.SphereBufferGeometry(radius, 64.0, 48.0),
        new THREE.MeshPhongMaterial({
            map: texture
        })
    );

    this.add(earth);
}

Earth.prototype = Object.create(THREE.Object3D.prototype);

Earth.prototype.createMarker = function (lat, lon, name) {
    var marker = new Marker();
    marker.name = `m${name}` 

    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    var r = this.userData.radius;

    marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
    marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

    this.add(marker);
};

// ------ Three.js code ------------------------------------------------

let scene, camera, renderer;
let controls;
let earth

init();

function init() {
    let container = document.getElementById( 'container' );
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, 4 / 3);
    camera.position.set(0.0, 1.3, 4.0);

    renderer = new THREE.WebGLRenderer({ antialias: true });

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = -1.0;
    controls.enablePan = false;

    var ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    var direcitonal = new THREE.DirectionalLight(0xffffff, 0.4);
    direcitonal.position.set(5.0, 2.0, 5.0).normalize();
    scene.add(direcitonal);

    // just some code for the loading
    var manager = createLoader(renderer.domElement, animate);

    var texLoader = new THREE.TextureLoader(manager).setCrossOrigin(true);

    var texture = texLoader.load('https://s3-eu-west-2.amazonaws.com/bckld/lab/textures/earth_latlon.jpg');
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    earth = new Earth(1.0, texture);
    // const interval = setInterval(() => {
    //     if(DATA.QUAKES > )
    // }, 5000)
    // function quakeLoadHandler() {
    //     console.log('here', localQuakes);
    //     localQuakes.forEach(quake => {
    //         earth.createMarker(quake)
    //     })
        
    // }

    // earth.createMarker(48.856700, 2.350800); // Paris
    // earth.createMarker(51.507222, -0.1275); // London
    // earth.createMarker(34.050000, -118.250000); // LA
    // earth.createMarker(41.836944, -87.684722); // Chicago
    // earth.createMarker(35.683333, 139.683333); // Tokyo
    // earth.createMarker(33.333333, 44.383333); // Baghdad
    // earth.createMarker(40.712700, -74.005900); // New York

    // earth.createMarker(55.750000, 37.616667); // Moscow
    // earth.createMarker(35.117500, -89.971111); // Memphis
    // earth.createMarker(-33.925278, 18.423889); // Cape Town
    // earth.createMarker(32.775833, -96.796667); // Dallas
    // earth.createMarker(52.366667, 4.900000); // Amsterdam
    // earth.createMarker(42.358056, -71.063611); // Boston
    // earth.createMarker(52.507222, 13.145833); // Berlin

    // earth.createMarker(37.783333, -122.416667); // San Francisco

    scene.add(earth);

    window.addEventListener('resize', onResize);
    onResize();

    container.prepend(renderer.domElement);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    // checkDATA()
    controls.update();

    renderer.render(scene, camera);
}

let count = 0
const checkDATA = setInterval(() => {
    let len = DATA.QUAKES.length
    if(len > 0) {
        let delay = 5000 / len
        DATA.QUAKES.forEach((quake, index) => {
            let length = len
            setTimeout(() => {
                if(count <= len){
                    // console.log('here', count);
                    earth.createMarker(quake[0], quake[1], count)
                    scene.add(earth)
                    count++
                    console.log(len, length)
                } else if(count > len){  // NEED TO DELETE MARKERS
                    DATA.QUAKES = []
                    for(let i = 0; i < count - 1; i++) {
                        let selectedMarker = scene.getObjectByName(`m${i}`)
                        console.log('marker', selectedMarker)
                        scene.remove(selectedMarker)
                    }
                    count = 0
                }
            }, index * delay)
        })
    }
}, 5000)