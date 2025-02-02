import { Request } from "express";

const getIpAddress = (req: Request): string => {
    return req.socket.remoteAddress as string
}

export default getIpAddress