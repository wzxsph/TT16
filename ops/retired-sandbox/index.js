const securityHeaders = {
  'Cache-Control': 'no-store',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
}

export default {
  fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'gone', message: 'This API has been permanently retired.' }), {
        status: 410,
        headers: { ...securityHeaders, 'Content-Type': 'application/problem+json; charset=utf-8' },
      })
    }

    return new Response(null, {
      status: 308,
      headers: { ...securityHeaders, Location: env.FREE_SITE_URL },
    })
  },
}
