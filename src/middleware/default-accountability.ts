import {Socket} from "socket.io";
import {Accountability} from "@directus/types"

export default function (socket: Socket, next: (err?: Error | undefined) => void) {
    const accountability: Accountability = {
        user: null,
        role: null,
        admin: false,
        app: false,
        ip: socket.handshake.address
    }

    socket.handshake.auth.accountability = accountability

    next()
}