import { buildApp } from './app'

const app = buildApp()

app.listen({ port: 4000, host: '0.0.0.0' })
    .then(() => {
        console.log('Server running on http://localhost:4000')
    })
    .catch(err => {
        app.log.error(err)
        process.exit(1)
    })
