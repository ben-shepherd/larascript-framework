import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { generateUuidV4 } from "@src/core/util/uuid/generateUuidV4";
import { NextFunction, Response } from "express";

type Props = {
    // eslint-disable-next-line no-unused-vars
    generator: (...args: any[]) => string;
    setHeader: boolean;
    headerName: string;
}

const defaultProps: Props = {
    generator: generateUuidV4,
    setHeader: true,
    headerName: 'X-Request-Id'
}

/**
 * Sets a request id on the request object and sets the response header if desired
 *
 * @param {Props} props - Options to configure the request id middleware
 * @param {string} [props.generator=generateUuidV4] - Function to generate a request id
 * @param {boolean} [props.setHeader=true] - If true, sets the response header with the request id
 * @param {string} [props.headerName='X-Request-Id'] - Name of the response header to set
 * @returns {import("express").RequestHandler} - The middleware function
 */
const requestIdMiddleware = ({ generator, setHeader, headerName }: Props = defaultProps) => (req: BaseRequest, res: Response, next: NextFunction) => {
    const oldValue = req.get(headerName)
    const id =  oldValue ?? generator()

    if(setHeader) {
        res.set(headerName, id)
    }

    req.id = id
    next()
}

export default requestIdMiddleware