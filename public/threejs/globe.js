import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js'

import Stats from './stats.module.js';

import { pointsArr } from './points.js'

let container, stats;

let camera, scene, renderer, controls, directionalLight;

let points;

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    //

    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.z = 2500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x222222 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    directionalLight = new THREE.DirectionalLight( 0xffffff, 1)
    scene.add(directionalLight)

    //

    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];

    const color = new THREE.Color();
    for(let point of pointsArr) {
        const {x, y, z} = flatPointsToCoords(point.x, point.y)
        
        positions.push(x, y, z)

        const vx = ( x / 1000 ) + 0.5;
        const vy = ( y / 1000 ) + 0.5;
        const vz = ( z / 1000 ) + 0.5;

        color.setRGB( vx, vy, vz );

        colors.push( color.r, color.g, color.b )
    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    //

    const material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );

    points = new THREE.Points( geometry, material );
    scene.add( points );

    //
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( renderer.domElement );
    
    // orbitcontrols

    controls = new OrbitControls(camera, container)
    controls.enableDamping = true
    controls.autoRotate = true
    controls.rotateSpeed = 0.7
    controls.maxPolarAngle = Math.PI / 1.4
    controls.minPolarAngle = Math.PI / 2.5

    //

    stats = new Stats();
    container.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    controls.update()

    render();
    stats.update();

}

function render() {

    const time = Date.now() * 0.001;

    // points.rotation.x = time * 0.0;
    // points.rotation.y = time * 0.2;

    renderer.render( scene, camera );

}
function flatPointsToCoords(x, y) {
    const globeRadius = 450
    const mapWidth = 4098 / 2
    const mapHeight = 1968 / 2
    
    let lat = ((x - mapWidth) / mapWidth) * -180
    let long = ((y - mapHeight) / mapHeight) * -90
    lat = (lat * Math.PI) / 180
    long = (long * Math.PI) / 180
    const radius = Math.cos(long) * globeRadius
    
    const obj = {
        x: Math.cos(lat) * radius,
        y: Math.sin(long) * globeRadius,
        z: Math.sin(lat) * radius
    }
    return obj
}