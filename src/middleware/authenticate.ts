import {Socket} from "socket.io"
import {Accountability, HookExtensionContext} from "@directus/types"
import * as jwt from "jsonwebtoken"
import {Knex} from 'knex'
import {JwtPayload} from "jsonwebtoken"

async function extractFromKnex(token: string, knex: Knex): Promise<JwtPayload | null> {
    return knex
        .select('directus_users.id', 'directus_users.role', 'directus_roles.admin_access', 'directus_roles.app_access')
        .from('directus_users')
        .leftJoin('directus_roles', 'directus_users.role', 'directus_roles.id')
        .where({
            'directus_users.token': token,
            status: 'active',
        })
        .first()
}

export default async function (socket: Socket, next: (err?: Error | undefined) => void) {
    const authorization = socket.handshake.headers.authorization
    if(!authorization) return next()

    const parts = authorization.split(' ')
    if(parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer') return next()

    const token = parts[1]

    // @ts-ignore
    const { database: knex, exceptions, env } = this as HookExtensionContext

    if(!token) return next()

    const decoded = jwt.decode(token, { json: true })

    const payload = decoded?.iss !== 'directus' ? await extractFromKnex(token, knex) : jwt.verify(token, env['SECRET'], {
        issuer: 'directus'
    }) as JwtPayload

    if(!payload) return next()

    const result: Accountability = {
        role: payload.role,
        admin: payload.admin_access === true || payload.admin_access == 1,
        app: payload.app_access === true || payload.app_access == 1,
        ip: socket.handshake.address
    }

    if(payload.share) result.share = payload.share
    if(payload.share_scope) result.share_scope = payload.share_scope
    if(payload.id) result.user = payload.id

    socket.handshake.auth.accountability = result

    next()
}