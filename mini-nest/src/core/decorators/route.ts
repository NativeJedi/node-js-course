import DECORATORS_KEYS from './keys';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

type RouteMetadata = {
  method: Method;
  path: string;
  handlerName: string;
};

function Route(method: Method, path = ''): MethodDecorator {
  return function (target, propertyKey) {
    const existedRoutes =
      Reflect.getMetadata(
        DECORATORS_KEYS.controllerRoutes,
        target.constructor
      ) ?? [];

    const routeMetaData: RouteMetadata = {
      method,
      path,
      handlerName: String(propertyKey),
    };

    existedRoutes.push(routeMetaData);

    Reflect.defineMetadata(
      DECORATORS_KEYS.controllerRoutes,
      existedRoutes,
      target.constructor
    );
  };
}

const Get = (path = '') => Route('get', path);
const Post = (path = '') => Route('post', path);
const Put = (path = '') => Route('put', path);
const Patch = (path = '') => Route('patch', path);
const Delete = (path = '') => Route('delete', path);

export { Route, RouteMetadata, Get, Post, Put, Patch, Delete };
