console.log('Hi from globe.js')
function go() {
    const container = document.querySelector('#globe')
    const canvas = document.querySelector('#globeCanvas')
    
    function init(points) {
        // const { width, height } = container.getBoundingClientRect()
        const width = window.innerWidth
        const height = window.innerHeight
    
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, width / height)
        const renderer = new THREE.WebGLRenderer({canvas})
        renderer.setSize(width, height)
    
        // const mergedGeometry = new THREE.SphereGeometry()
        // const pointGeometry = new THREE.SphereGeometry(0.5, 1, 1)
        // const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee })
    
        function secondTry() {
            scene.add(new THREE.AmbientLight(0x333333))

            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(5, 3, 5)
            scene.add(light)

            const geo = new THREE.SphereGeometry(0.5, 32, 32)
            const map = new THREE.TextureLoader().load('../misc/dots.jpg')
            const mat = new THREE.MeshBasicMaterial({map: map})
            const mesh = new THREE.Mesh(geo, mat)
            scene.add(mesh)
        }
        secondTry()

        // const globeRadius = 100
        // const globeWidth = 4098 / 2
        // const globeHeight = 1968 / 2
    
        // function convertFlatCoordsToSphereCoords(x, y) {
        //     let lat = ((x - globeWidth) / globeWidth) * -180
        //     let long = ((y - globeHeight) / globeHeight) * -90
        //     lat = (lat * Math.PI) / 180
        //     long = (long * Math.PI) / 180
        //     const radius = Math.cos(long) * globeRadius
    
        //     return {
        //         x: Math.cos(lat) * radius,
        //         y: Math.sin(long) * globeRadius,
        //         z: Math.sin(lat) * radius
        //     }
        // }
        // for(let point of points) {
        //     const { x, y, z} = convertFlatCoordsToSphereCoords(point.x, point.y)
    
        //     pointGeometry.translate(x, y, z)
        //     mergedGeometry.merge(pointGeometry)
        //     pointGeometry.translate(-x, -y, -z)
        // }
    
        // const globeShape = new THREE.Mesh(mergedGeometry, pointMaterial)
        // scene.add(globeShape)
    
        function animate() {
            requestAnimationFrame(animate)
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
        // const getPoints = async () => {
        //     const res = await window.fetch('./js/points.json')
        //     const data = await res.json()
        //     init(data.points);
        // }
        // getPoints()
        init()
    } else {
        console.log('No WebGL')
    }
}
go()
