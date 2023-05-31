import { ItemsService } from '@directus/api'
import { HookExtensionContextSocket } from '../types'

export default async function (request, callback) {
    // @ts-ignore
    const config = this as HookExtensionContextSocket

    const { database: knex, services, logger, getSchema, socket } = config

    const log = `SOCKET /items/${request.collection}/${request.method} -> ${JSON.stringify(request.args)}}`

    try {
        const items = new (services.ItemsService as typeof ItemsService)(request.collection, {
            knex,
            schema: await getSchema(),
            accountability: socket.handshake.auth.accountability
        })

        const result = await items[request.method](...request.args)

        callback({
            success: true,
            data: result
        })

        logger.info(log)
    }
    catch (e) {
        callback({
            success: false,
            error: e!.toString()
        })

        logger.error(e, log)
    }
}