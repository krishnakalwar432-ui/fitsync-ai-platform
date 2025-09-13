// FitSync AI Service Worker - PWA Offline Functionality
const CACHE_NAME = 'fitsync-ai-v1.0.0'
const STATIC_CACHE = 'fitsync-static-v1'
const DYNAMIC_CACHE = 'fitsync-dynamic-v1'
const API_CACHE = 'fitsync-api-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
  '/_next/static/css/app.css',
  '/_next/static/chunks/framework.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/webpack.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API endpoints to cache
const API_ROUTES = [
  '/api/workout',
  '/api/nutrition', 
  '/api/ai/chat'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker')
  
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim()
    ])
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle different types of requests
  if (request.method === 'GET') {
    // API requests
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleApiRequest(request))
    }
    // Static assets and pages
    else {
      event.respondWith(handleStaticRequest(request))
    }
  }
  // Handle POST requests for offline functionality
  else if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request))
  }
})

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, serving offline page')
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/offline')
      return offlineResponse || new Response('Offline - Please check your connection')
    }
    
    throw error
  }
}

// Handle API requests with caching
async function handleApiRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Always try network first for fresh data
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.log('[SW] API network failed, checking cache')
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Add offline indicator to cached response
      const responseClone = cachedResponse.clone()
      const data = await responseClone.json()
      
      return new Response(JSON.stringify({
        ...data,
        offline: true,
        message: 'This data was served from cache while offline'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Return offline fallback for specific endpoints
    return handleOfflineApiResponse(url.pathname)
  }
}

// Handle POST requests for offline functionality
async function handlePostRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Try network first
    return await fetch(request)
  } catch (error) {
    // Store for background sync if offline
    if (url.pathname.startsWith('/api/')) {
      await storeOfflineRequest(request)
      return new Response(JSON.stringify({
        success: true,
        offline: true,
        message: 'Request stored for when connection is restored'
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    throw error
  }
}

// Store offline requests for background sync
async function storeOfflineRequest(request) {
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text(),
    timestamp: Date.now()
  }
  
  // Store in IndexedDB for background sync
  const db = await openOfflineDB()
  const transaction = db.transaction(['requests'], 'readwrite')
  const store = transaction.objectStore('requests')
  await store.add(requestData)
}

// Open IndexedDB for offline storage
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FitSyncOffline', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('requests')) {
        const store = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true })
        store.createIndex('timestamp', 'timestamp')
      }
      
      if (!db.objectStoreNames.contains('workouts')) {
        const store = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true })
        store.createIndex('date', 'date')
      }
      
      if (!db.objectStoreNames.contains('nutrition')) {
        const store = db.createObjectStore('nutrition', { keyPath: 'id', autoIncrement: true })
        store.createIndex('date', 'date')
      }
    }
  })
}

// Offline fallback responses for API endpoints
function handleOfflineApiResponse(pathname) {
  const offlineResponses = {
    '/api/ai/chat': {
      message: "I'm currently offline, but here are some quick fitness tips: Stay hydrated, focus on compound movements, and remember that consistency beats perfection!",
      suggestions: ["Offline workout tips", "Basic exercises", "Nutrition basics"],
      offline: true
    },
    '/api/workout': {
      workout: {
        name: "Offline Bodyweight Workout",
        exercises: [
          { name: "Push-ups", sets: 3, reps: 10, rest: "60s" },
          { name: "Squats", sets: 3, reps: 15, rest: "60s" },
          { name: "Plank", sets: 3, reps: "30s", rest: "60s" }
        ]
      },
      offline: true
    },
    '/api/nutrition': {
      mealPlan: {
        meals: [
          { type: "breakfast", suggestions: ["Oatmeal with fruits", "Greek yogurt with nuts"] },
          { type: "lunch", suggestions: ["Grilled chicken salad", "Quinoa bowl"] },
          { type: "dinner", suggestions: ["Baked fish with vegetables", "Lentil soup"] }
        ]
      },
      offline: true
    }
  }
  
  const response = offlineResponses[pathname] || {
    error: "Service unavailable offline",
    offline: true
  }
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  })
}

// Background sync for offline requests
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  if (event.tag === 'offline-requests') {
    event.waitUntil(syncOfflineRequests())
  }
})

// Sync offline requests when connection is restored
async function syncOfflineRequests() {
  try {
    const db = await openOfflineDB()
    const transaction = db.transaction(['requests'], 'readonly')
    const store = transaction.objectStore('requests')
    const requests = await store.getAll()
    
    for (const requestData of requests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        })
        
        if (response.ok) {
          // Remove synced request
          const deleteTransaction = db.transaction(['requests'], 'readwrite')
          const deleteStore = deleteTransaction.objectStore('requests')
          await deleteStore.delete(requestData.id)
          
          console.log('[SW] Synced offline request:', requestData.url)
        }
      } catch (error) {
        console.log('[SW] Failed to sync request:', error)
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error)
  }
}

// Push notifications for workout reminders
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'Time for your workout!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start-workout',
        title: 'Start Workout',
        icon: '/icons/action-workout.png'
      },
      {
        action: 'snooze',
        title: 'Remind me later',
        icon: '/icons/action-snooze.png'
      }
    ],
    requireInteraction: true
  }
  
  event.waitUntil(
    self.registration.showNotification('FitSync AI Reminder', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'start-workout') {
    event.waitUntil(
      clients.openWindow('/workout')
    )
  } else if (event.action === 'snooze') {
    // Schedule another notification for later
    console.log('[SW] Workout reminder snoozed')
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
  
  if (event.data && event.data.type === 'CACHE_WORKOUT') {
    cacheWorkoutData(event.data.workout)
  }
})

// Cache workout data for offline use
async function cacheWorkoutData(workout) {
  try {
    const db = await openOfflineDB()
    const transaction = db.transaction(['workouts'], 'readwrite')
    const store = transaction.objectStore('workouts')
    await store.put({
      ...workout,
      date: new Date().toISOString(),
      cached: true
    })
    console.log('[SW] Workout data cached for offline use')
  } catch (error) {
    console.log('[SW] Failed to cache workout data:', error)
  }
}