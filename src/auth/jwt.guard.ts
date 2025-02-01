import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { ICustomExpressRequest } from 'common/middlewares/reqres.middleware';
import { IJWTTokenData } from 'common/model/common.model';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest() as ICustomExpressRequest;
    if (!request.extras.jwtData()) return false;
    return true;
  }
}

export const RoleAuthGuard = (roles: string[]) => {
  @Injectable()
  class RoleAuthGuardMixin implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context
        .switchToHttp()
        .getRequest() as ICustomExpressRequest;
      const tokenData: IJWTTokenData | boolean = request.extras.jwtData() as
        | IJWTTokenData
        | boolean;
      if (tokenData && tokenData instanceof Object && !tokenData?.roles)
        return false;

      if (
        tokenData instanceof Object &&
        JSON.stringify(roles.sort()) == JSON.stringify(tokenData.roles.sort())
      )
        return true;

      return false;
    }
  }

  return mixin(RoleAuthGuardMixin);
};
