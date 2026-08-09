import worker from '../ops/retired-sandbox/index.js'

function assert(condition, message) {
  if (!condition) throw new Error(`Retired sandbox verification failed: ${message}`)
}

const env = { FREE_SITE_URL: 'https://example.test/' }
for (const pathname of ['/api', '/api/', '/api/v1/health', '/api/anything']) {
  const response = await worker.fetch(new Request(`https://legacy.example${pathname}`), env)
  assert(response.status === 410, `${pathname} must return 410`)
  assert(response.headers.get('cache-control') === 'no-store', `${pathname} must not be cached`)
  assert((await response.json()).error === 'gone', `${pathname} must return a stable problem response`)
}

for (const pathname of ['/', '/types/RHDP/', '/old/paywall?ignored=1']) {
  const response = await worker.fetch(new Request(`https://legacy.example${pathname}`), env)
  assert(response.status === 308, `${pathname} must return 308`)
  assert(response.headers.get('location') === env.FREE_SITE_URL, `${pathname} must redirect to the free site`)
}

console.log('Retired sandbox verified: all API paths return 410 and all pages return a permanent free-site redirect.')
