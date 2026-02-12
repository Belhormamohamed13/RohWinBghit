
import { Platform } from 'react-native'

// Use localhost for iOS and 10.0.2.2 for Android emulator
// For physical device, you would need your machine's IP address
const DEV_API_URL = 'http://192.168.1.7:5001/api'

// Export the API URL
// In production, this would be an environment variable
export const API_URL = DEV_API_URL
