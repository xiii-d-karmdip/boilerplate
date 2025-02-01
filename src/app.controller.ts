import {
  Controller,
  Get,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { NextFunction, Request } from 'express';
import { TestDTO } from './app.dto';
import { AppService } from './app.service';
import { JwtAuthGuard, RoleAuthGuard } from './auth/jwt.guard';
import {
  ICustomExpressRequest,
  ICustomExpressResponse,
} from './common/middlewares/reqres.middleware';
import { MESSAGES } from './common/utils/constants';
import { environment } from 'environment/environment';

@ApiBearerAuth()
@Controller()
@ApiTags('App-Root')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(
    @Req() req: Request,
    @Res() res: ICustomExpressResponse,
    @Next() next: NextFunction,
  ) {
    return res.handler.success(
      MESSAGES.TEST.GET_SUCCESS,
      this.appService.getHello() + ' ' + environment.jwtSecret,
    );
  }

  @Post()
  @ApiBody({ type: TestDTO })
  async postHello(
    @Req() req: ICustomExpressRequest,
    @Res() res: ICustomExpressResponse,
    @Next() next: NextFunction,
  ) {
    return res.handler.success(
      MESSAGES.TEST.POST_SUCCESS,
      `Your message is ${req.body.message}`,
    );
  }

  @Get('jwt')
  @UseGuards(JwtAuthGuard)
  async jwtGuard(
    @Req() req: ICustomExpressRequest,
    @Res() res: ICustomExpressResponse,
    @Next() next: NextFunction,
  ) {
    return res.handler.success(MESSAGES.TEST.GET_SUCCESS, ``);
  }

  @Get('jwt-roles')
  @UseGuards(RoleAuthGuard(['Admin']))
  async jwtRoleGuard(
    @Req() req: ICustomExpressRequest,
    @Res() res: ICustomExpressResponse,
    @Next() next: NextFunction,
  ) {
    return res.handler.success(MESSAGES.TEST.GET_SUCCESS, ``);
  }
}
