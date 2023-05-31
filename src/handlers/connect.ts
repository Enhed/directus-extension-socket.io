import items from "../acknowledgements/items"
import {Socket} from "socket.io"
import {HookExtensionContext} from "@directus/types"

export function connect (socket: Socket) {
    // @ts-ignore
    const config = this as HookExtensionContext
    const { emitter, logger } = config

    emitter.emitAction('socket.connect', socket)

    logger.info(`SOCKET (${socket.handshake.address}) connect`)

    socket.once('disconnect', (reason) => {
        logger.info(`SOCKET (${socket.handshake.address}) disconnected by ${reason}`)
    })

    socket.on('items', items.bind({
        ...config,
        socket
    }))
}

export function connection(socket: Socket) {
    // @ts-ignore
    const config = this as HookExtensionContext
    config.emitter.emitAction('socket.connection', socket)
}