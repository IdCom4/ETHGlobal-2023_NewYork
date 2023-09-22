// currently unused, implemented as a head script in nuxt.config.ts
!(function(f, b, e, v, n, t, s) {
  if (f.fbq) return
  n = f.fbq = function(...args) {
    n.callMethod ? n.callMethod(...args) : n.queue.push(args)
  }
  if (!f._fbq) f._fbq = n
  n.push = n
  n.loaded = !0
  n.version = '2.0'
  n.queue = []
  t = b.createElement(e)
  t.async = !0
  t.src = v
  s = b.getElementsByTagName(e)[0]
  s.parentNode.insertBefore(t, s)
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
fbq('init', '669743703885993')
fbq('track', 'PageView')
