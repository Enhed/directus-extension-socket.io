import {HookExtensionContext} from "@directus/types"
import {Socket} from "socket.io";

export type HookExtensionContextSocket = HookExtensionContext & {
    socket: Socket
}