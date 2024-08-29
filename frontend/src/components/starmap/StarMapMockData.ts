import { StarmapQueryResult } from '../../graphql/queries/starmapQuery'

const mockUsers = [
  { id: '1', name: 'User1', lat: 40.7128, lng: -74.0060 },
  { id: '2', name: 'User2', lat: 51.5074, lng: -0.1278 },
  { id: '3', name: 'User3', lat: 48.8566, lng: 2.3522 },
  { id: '4', name: 'User4', lat: 35.6762, lng: 139.6503 },
  { id: '5', name: 'User5', lat: -33.8688, lng: 151.2093 },
]

const convertToRadians = (degrees: number) => degrees * (Math.PI / 180)

const mockStarmapData: StarmapQueryResult = {
  stars: mockUsers.map((user, index) => ({
    id: user.id,
    azimuth: convertToRadians(user.lng + 180), // Convert longitude to azimuth (0 to 2π)
    altitude: convertToRadians(user.lat), // Convert latitude to altitude (-π/2 to π/2)
    distance: 1 + Math.random() * 0.5, // Random distance between 1 and 1.5
    magnitude: 0.5 + Math.random() * 0.5, // Random magnitude between 0.5 and 1
    color: Math.floor(Math.random() * 0xFFFFFF), // Random color
  })),
  starLines: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '1' },
  ],
}

export { mockStarmapData }