/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const now = Date.now();
    console.log('Request...');
    res.on('close', () => {
        const { statusCode } = res;
        console.log(`HTTP Request ${method} ${url} ${statusCode} | ${Date.now()-now}ms`, {
        ignore: true,
        });
    });
    next();
  }
}
