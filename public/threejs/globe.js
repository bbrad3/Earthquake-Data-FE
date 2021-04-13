import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js'

import { BufferGeometryUtils } from './BufferGeometryUtils.js'

import Stats from './stats.module.js';

import { pointsArr } from './points.js'

import { DATA } from '../../app.js'

let container, stats;

let camera, scene, renderer, controls, directionalLight;

let points, quakes, locations;

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

    const globeGeometry = new THREE.BufferGeometry();
    const quakeGeometry = new THREE.BufferGeometry()
    const locationGeometry = new THREE.BufferGeometry()

    let positions = [];
    let quakePositions = []
    let locationPositions = []

    for(let point of pointsArr) {
        const {x, y, z} = flatPointsToCoords(point.x, point.y)
        positions.push(x, y, z)
        console.log('new position');
    }
    for(let quake of DATA.QUAKES){
        const lat = quake[0]
        const long = quake[1]
        const { x, y, z } = coordsToPoints(lat, long, 470)
        positions.push(x, y, z)
        console.log('new quake position')
    }
    
    quakeGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( quakePositions, 3 ))
    globeGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

    const combinedGeometry = BufferGeometryUtils.mergeBufferGeometries( [quakeGeometry, globeGeometry] )

    quakeGeometry.computeBoundingSphere()
    globeGeometry.computeBoundingSphere();

    //

    const quakeMaterial = new THREE.PointsMaterial( {color: 0xff0000, size: 15 } )
    const material = new THREE.PointsMaterial( {color: 0xcccccc, size: 15 } )
    
    quakes = new THREE.Points( quakeGeometry, quakeMaterial )
    points = new THREE.Points( globeGeometry, material );
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
    // console.log(scene.children);
    // console.log('DATA', DATA.DBLOCATIONS.length, DATA.QUAKES.length)

}

function render() {

    const time = Date.now() * 0.001;

    // points.rotation.x = time * 0.0;
    // points.rotation.y = time * 0.2;

    renderer.render( scene, camera );

}
function addQuakes() {
    console.log('made it here');
    if(DATA.QUAKES.length > 0) {

        
        
    
        
        scene.add( quakes )
    }
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
function coordsToPoints(lat, lon, radius) {
    const obj = {}
    const phi = (90-lat)*(Math.PI/180)
    const theta = (lon+180)*(Math.PI/180)

    obj.x = -(radius * Math.sin(phi)*Math.cos(theta))
    obj.y = (radius * Math.sin(phi)*Math.sin(theta))
    obj.z = (radius * Math.cos(phi))
    
    return obj
}