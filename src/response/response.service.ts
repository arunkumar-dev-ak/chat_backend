import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
  successResponse({
    res,
    data,
    message,
    statusCode = 400,
    initialDate,
  }: {
    res: Response;
    data: unknown;
    message: string;
    statusCode: number;
    initialDate: Date;
  }): unknown {
    const processSeconds =
      (new Date().getTime() - initialDate.getTime()) / 1000;
    return res.status(statusCode).json({
      status: true,
      message: message,
      statusCode: statusCode,
      data: data,
      processingTime: processSeconds,
    });
  }

  errorResponse({
    res,
    message,
    statusCode = 400,
    errors,
  }: {
    res: Response;
    message: unknown;
    statusCode: number;
    errors?: unknown;
  }): unknown {
    return res.status(statusCode).json({
      status: false,
      message: message,
      statusCode: statusCode,
      errors,
    });
  }
}
