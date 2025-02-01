import { Injectable, NestMiddleware, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { environment } from 'environment/environment';
import { IJWTTokenData } from '../model/common.model';
import { MESSAGES, STATUS_CODES } from '../utils/constants';

export class ResponseMiddlewareClass {
  req: Request;
  res: Response;
  next: NextFunction;
  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  sender(code: any, message: string, data: object, error: Error | null) {
    if (error) {
      console.log(
        '-----------------------------------------------------------------',
      );
      console.error(this.req.method + ' :: ' + this.req.originalUrl);
      console.error('Headers :: ', JSON.stringify(this.req.headers));
      console.error('Body :: ', JSON.stringify(this.req.body));
      console.error('ERROR :: ', error.message);
      console.log(
        '-----------------------------------------------------------------',
      );
    }

    this.res.status(code).json({
      message,
      data,
    });

    // process.env.ENABLE_ACCESS_LOGS will be added
  }

  // args : Status code, message, data object,  error object
  // custom(...args) {
  //     this.sender(...args);
  // }

  // 2XX SUCCESS
  success(message: string, data: any) {
    this.sender(STATUS_CODES.SUCCESS, message || 'STATUS.SUCCESS', data, null);
  }

  created(message: string, data: any) {
    this.sender(STATUS_CODES.CREATED, message || 'STATUS.CREATED', data, null);
  }

  // 4XX CLIENT ERROR
  badRequest(message: string, data: any) {
    this.sender(
      STATUS_CODES.BAD_REQUEST,
      message || 'STATUS.BAD_REQUEST',
      data,
      null,
    );
  }

  unauthorized(message: string, data: any = null) {
    this.sender(
      STATUS_CODES.UNAUTHORIZED,
      message || 'STATUS.UNAUTHORIZED',
      data,
      null,
    );
  }

  forbidden(message: string, data: any, error: Error) {
    this.sender(
      STATUS_CODES.FORBIDDEN,
      message || 'STATUS.FORBIDDEN',
      data,
      error,
    );
  }

  notFound(message: string, data: any = null) {
    this.sender(
      STATUS_CODES.NOT_FOUND,
      message || 'STATUS.NOT_FOUND',
      data,
      null,
    );
  }
  // notFound(message: string, data: any = null, error: Error = new Error()) {
  //     this.sender(STATUS_CODES.NOT_FOUND, message || 'STATUS.NOT_FOUND', data, error);
  // }

  // 5XX SERVER ERROR
  serverError(error: Error, data: any = null) {
    this.sender(STATUS_CODES.SERVER_ERROR, MESSAGES.SERVER_ERROR, data, error);
  }
}

export class RequestMiddlewareClass {
  req: Request;
  res: Response;
  next: NextFunction;
  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  jwtData(): IJWTTokenData | boolean {
    const auth = this.req.headers?.authorization;
    if (auth) {
      const token = auth.split(' ')[1];
      const tokenData = jwt.verify(
        token,
        environment.jwtSecret,
      ) as IJWTTokenData;
      return tokenData;
    }
    return false;
  }
}

export interface ICustomExpressResponse extends Response {
  handler: ResponseMiddlewareClass;
}

export interface ICustomExpressRequest extends Request {
  extras: RequestMiddlewareClass;
}

@Injectable()
export class ReqResMiddleware implements NestMiddleware {
  use(
    @Req() req: ICustomExpressRequest,
    @Res() res: ICustomExpressResponse,
    @Next() next: NextFunction,
  ) {
    req.extras = new RequestMiddlewareClass(req, res, next);
    res.handler = new ResponseMiddlewareClass(req, res, next);
    next();
  }
}
