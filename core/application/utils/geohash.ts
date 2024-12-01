import { RADIUS_OF_EARTH } from '../../../commons/libs/constants/NoMagicNumbers'
import ngeohash from 'ngeohash'

export function generateGeohash(latitude: number, longitude: number, precision: number = 8): string {
  return ngeohash.encode(latitude, longitude, precision)
}

export function decodeGeohash(geohash: string): { latitude: number; longitude: number } | null {
  if (geohash.trim() === '') {
    return null
  }

  try {
    const { latitude, longitude } = ngeohash.decode(geohash)
    return { latitude, longitude }
  } catch (error) {
    return null
  }
}

function getNeighbors(geohash: string): string[] {
  return ngeohash.neighbors(geohash)
}

export function getGeohashNthNeighbors(geohash: string, neighborLevel: number): string[] {
  const visited = new Set()
  visited.add(geohash)

  let currentLevel = [{
    hash: geohash,
    level: 0
  }]
  const nthLevelNeighbors = []

  for (let i = 0; i < neighborLevel; i++) {
    const nextLevel = []

    for (const current of currentLevel) {
      const neighbors = getNeighbors(current.hash)

      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue

        visited.add(neighbor)
        nextLevel.push({
          hash: neighbor,
          level: current.level + 1
        })

        if (current.level + 1 === neighborLevel) {
          nthLevelNeighbors.push(neighbor)
        }
      }
    }
    currentLevel = nextLevel
  }

  return nthLevelNeighbors
}

export function getDistanceBetweenGeohashes(geohash1: string, geohash2: string): number {
  const { latitude: lat1, longitude: lon1 } = ngeohash.decode(geohash1)
  const { latitude: lat2, longitude: lon2 } = ngeohash.decode(geohash2)

  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

  const radiusOfEarth = RADIUS_OF_EARTH
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)

  const centralAngle =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const angularDistance = 2 * Math.atan2(Math.sqrt(centralAngle), Math.sqrt(1 - centralAngle))
  return parseFloat((radiusOfEarth * angularDistance).toFixed(2))
}
