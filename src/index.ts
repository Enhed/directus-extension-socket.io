import { defineHook } from '@directus/extensions-sdk'
import startServer from "./start-server"

export default defineHook(async ({action}, config) => {
    action('server.start', startServer.bind(config))
})