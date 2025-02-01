import { ISwagConfig } from 'common/model/common.model';
export const environment = {
  production: false,
  port: 80,
  swagger: {
    title: 'Project Title',
    description: 'Description',
    version: '1.0.0',
    tag: 'Boilerplate',
    swaggerEndpoint: 'apis', // 'HOST/apis'
  } as ISwagConfig,
  jwtSecret: 'Your Secret',
};