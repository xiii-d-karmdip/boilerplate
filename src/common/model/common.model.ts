export interface ISwagConfig {
  title: string;
  description: string;
  version: string;
  tag: string;
  swaggerEndpoint: string;
}

export interface ICommonResponse<T> {
  message: string;
  data: T;
}

export interface IJWTTokenData {
  id: string;
  roles: string[];
  userName: string;
}

export interface IReqestExtras {
  jwtData: IJWTTokenData;
}
