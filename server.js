const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('🚀 Starting Next.js server...')

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true)
      
      // Handle the request
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })
  .listen(port, (err) => {
    if (err) throw err
    console.log(`✅ Server ready on http://${hostname}:${port}`)
    console.log(`📄 PDF generation: ${dev ? 'Development' : 'Production'} mode`)
  })
  .on('error', (err) => {
    console.error('❌ Server error:', err)
  })
})
.catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})