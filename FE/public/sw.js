// Service Worker for caching and performance optimization
const CACHE_NAME = 'decalstudio-v1';
const STATIC_CACHE_NAME = 'decalstudio-static-v1';
const API_CACHE_NAME = 'decalstudio-api-v1';

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/design',
  '/profile',
  '/cart',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/auth/me'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_RESOURCES);
      }),
      caches.open(API_CACHE_NAME)
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static resources
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle page requests
  event.respondWith(handlePageRequest(request));
});

// Handle API requests with cache-first strategy for specific endpoints
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Cache certain API endpoints
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    try {
      const cache = await caches.open(API_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        // Return cached response and update in background
        fetchAndCache(request, cache);
        return cachedResponse;
      }
      
      // Fetch and cache
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      return new Response('Network error', { status: 503 });
    }
  }
  
  // For other API requests, just fetch
  return fetch(request);
}

// Handle static resources with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Static request failed:', error);
    return fetch(request);
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful page responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error
    return new Response('Offline', { status: 503 });
  }
}

// Background fetch and cache
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.error('Background fetch failed:', error);
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any offline actions that need to be synced
  console.log('Background sync triggered');
}
