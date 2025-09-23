# API Usage Guide

This project has integrated a complete API management system, including authentication and card-related interfaces.

## 📁 File Structure

```
src/api/
├── auth.ts          # Authentication related API
├── card.ts          # Card related API
├── index.ts         # API unified export
└── README.md        # Usage documentation

src/stores/
├── auth.ts          # Authentication state management
├── card.ts          # Card state management
└── counter.ts       # Counter state management
```

## 🔐 Authentication API

### Send Email Verification Code
```typescript
import { AuthAPI } from '@/api/auth'

const result = await AuthAPI.sendEmail({ email: 'user@example.com' })
```

### User Login
```typescript
const result = await AuthAPI.login({ 
  email: 'user@example.com', 
  code: '123456' 
})
```

### Refresh Token
```typescript
const result = await AuthAPI.refreshToken({ 
  refresh_token: 'your-refresh-token' 
})
```

### User Logout
```typescript
const result = await AuthAPI.logout({ 
  refresh_token: 'your-refresh-token' 
})
```

## 💳 Card API

### Get Card Configuration
```typescript
import { CardAPI } from '@/api/card'

const headers = {
  token: 'your-token',
  'fingerprint-id': 'device-fingerprint',
  refresh_token: 'your-refresh-token'
}

const result = await CardAPI.getCardConfig(headers)
```

### Query Card BIN
```typescript
const result = await CardAPI.queryCardBin(
  { cardFormFactor: 'virtual_card' },
  headers
)
```

## 🏪 State Management

### Authentication State Management
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login
await authStore.login({ email: 'user@example.com', code: '123456' })

// Logout
await authStore.logout()

// Check login status
const isLoggedIn = authStore.isLoggedIn
```

### Card State Management
```typescript
import { useCardStore } from '@/stores/card'

const cardStore = useCardStore()

// Get card configuration
await cardStore.fetchCardConfigs()

// Query card BIN
await cardStore.fetchCardBins({ cardFormFactor: 'virtual_card' })

// Get enabled cards
const enabledCards = cardStore.enabledCards
```

## 🔄 Persistence Configuration

All stores are configured with persistence, data will be automatically saved to localStorage:

- **auth-store**: Save authentication information (user info, token, etc.)
- **card-store**: Save card configuration and BIN information
- **counter-store**: Save counter state

## 🛡️ Request Interceptors

API service has configured automatic interceptors:

1. **Request Interceptor**:
   - Automatically add authentication token
   - Add anti-cache timestamp
   - Request log recording

2. **Response Interceptor**:
   - Automatically handle business errors
   - Auto refresh expired tokens
   - Network error handling

## 📱 Page Routes

- `/` - Home page
- `/login` - Login page
- `/apply-card` - Apply card page
- `/card-bin-selection` - Card BIN selection page

## 🎯 Usage Examples

### Complete Login Flow
```typescript
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const toast = useToast()

// 1. Send verification code
const sendResult = await authStore.sendEmailCode({ email: 'user@example.com' })
if (sendResult.success) {
  toast.add({
    severity: 'success',
    summary: 'Verification code sent',
    detail: 'Please check your email'
  })
}

// 2. Login
const loginResult = await authStore.login({ 
  email: 'user@example.com', 
  code: '123456' 
})
if (loginResult.success) {
  toast.add({
    severity: 'success',
    summary: 'Login successful',
    detail: 'Welcome back!'
  })
  // Navigate to card list page
  router.push('/apply-card')
}
```

### Get Card Configuration Flow
```typescript
import { useCardStore } from '@/stores/card'

const cardStore = useCardStore()

// Get card configuration
const result = await cardStore.fetchCardConfigs()
if (result.success) {
  // Get enabled cards
  const enabledCards = cardStore.enabledCards
  
  // Get specific card by name
  const specificCard = cardStore.getCardConfigByName('virtual_card')
  
  // Query BIN information for this card
  if (specificCard) {
    const cardFormFactor = specificCard.cardPattern === 1 ? 'virtual_card' : 'physical_card'
    await cardStore.fetchCardBins({ cardFormFactor })
  }
}
```

## 🔧 Configuration

### API Basic Configuration
- **Base URL**: `https://api.biulinkpay.online`
- **Timeout**: 10 seconds
- **Headers**: Automatically add Content-Type and authentication information

### Persistence Configuration
- **Storage Method**: localStorage
- **Data Expiration**: Manual clearing or browser cleanup
- **Sensitive Data**: Only save necessary authentication information

## 🚀 Development Recommendations

1. **Error Handling**: Always check the success field returned by the API
2. **Loading State**: Use the loading state in the store to display loading animations
3. **Data Caching**: Use persistence to reduce unnecessary API calls
4. **Type Safety**: Use TypeScript types to ensure data structure correctness
