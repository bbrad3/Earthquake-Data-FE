console.log('hello from tryAgain.js')
function go() {
    const globeDiv = document.querySelector('#globe')
    const canvas = document.querySelector('#canvas')
    // const ctx = canvas.getContext('2d')

    // ctx.fillStyle = 'black'
    // ctx.fillRect(0, 0, 500, 500)

    function init() {
        const width = window.innerWidth
        const height = window.innerHeight
    
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, width / height)
        camera.position.z = 2
        const renderer = new THREE.WebGLRenderer({canvas})
        renderer.setSize(width, height)

        scene.add(new THREE.AmbientLight(0x333333))

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(5, 3, 5)
        scene.add(light)

        const globe = new THREE.SphereGeometry(0.5, 32, 32)
        const map = new THREE.TextureLoader().load('../misc/dots.jpg')
        const material = new THREE.MeshBasicMaterial({map: map})
        const mesh = new THREE.Mesh(globe, material)
        scene.add(mesh)

        // const spaceSphere = new THREE.SphereGeometry(90, 64, 64)
        const spaceMap = new THREE.TextureLoader().load('../misc/space.jpg')
        // const spaceMat = new THREE.MeshBasicMaterial({map: spaceMap})
        // const spaceMesh = new THREE.Mesh(spaceSphere, spaceMat)
        scene.background = {map: spaceMap}
        // scene.add(spaceMesh)

        //orbitcontrols
        const controls = new THREE.OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.autoRotate = true

        function animate() {
            requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene,camera)
        }
        animate()
    }

    function hasWebGL() {
        const gl =
            canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        if (gl && gl instanceof WebGLRenderingContext) {
            return true;
        } else {
            return false;
        }
    }
    if (hasWebGL()) {
        init()
    } else {
        console.log('No WebGL')
    }
}
go()