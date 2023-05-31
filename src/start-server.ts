import {Server} from "socket.io"
import {HookExtensionContext} from "@directus/types"
import authenticate from "./middleware/authenticate"
import {connect, connection} from "./handlers/connect"
import defaultAccountability from "./middleware/default-accountability"

export default async function (meta: Record<string, any>) {
    // @ts-ignore
    const config = this as HookExtensionContext
    const { emitter } = config

    const io = new Server(meta.server)

    io.use(defaultAccountability)
    io.use(authenticate.bind(config))

    io.on('connect', connect.bind(config))
    io.on('connection', connection.bind(config))

    emitter.emitInit('socket.after', io)
}