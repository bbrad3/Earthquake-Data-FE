import {pointsArr} from './points.js'
console.log('pointsArr', pointsArr)
// EXPORT VALUES
export const COMPUTATIONS = {
    coords: new Int16Array(),
    points: [],
    // LOOP THROUGH points
    coordsToPoints: (lat, lon, radius) => {
        const point = {}
        const phi = (90-lat)*(Math.PI/180)
        const theta = (lon+180)*(Math.PI/180)

        point.x = -(radius * Math.sin(phi)*Math.cos(theta))
        point.y = (radius * Math.sin(phi)*Math.sin(theta))
        point.z = (radius * Math.cos(phi))
        COMPUTATIONS.points.push(point)
    },

    flatPointsToCoords: (x, y) => {
        const globeRadius = 100
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
}

// const tokyoCoords = [35.3687, 139.6922]
// COMPUTATIONS.coordsToPoints(tokyoCoords[0], tokyoCoords[1], 100)

COMPUTATIONS.coords = [] // initialize to empty
pointsArr.forEach(point => {
    const xyz = COMPUTATIONS.flatPointsToCoords(point.x, point.y)
    COMPUTATIONS.coords.push(xyz)
})

console.log('tokyoPoints', COMPUTATIONS.points)
console.log(COMPUTATIONS.coords.length)

// module.exports = COMPUTATIONS