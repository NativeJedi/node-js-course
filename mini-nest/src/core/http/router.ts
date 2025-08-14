import express from 'express';
import DECORATORS_KEYS from '../../core/decorators/keys';
import { RouteMetadata } from '../../core/decorators/route';
import { container } from '../container';
import { ClassInstance, ClassType } from '../types';
import { HandlerMiddleware } from './middlewares/handler.middleware';
import { Pipe } from '../decorators/use-pipes';
import { GuardsMiddleware } from './middlewares/guard.middleware';
import { Guard } from '../decorators/use-guards';
import { FiltersMiddleware } from './middlewares/filters.middleware';
import { Filter } from '../decorators/use-filters';

function Factory(modules: ClassType[]) {
  const app = express();

  app.use(express.json());

  const router = express.Router();

  const globalPipes: Array<Pipe> = [];
  const globalGuards: Array<Guard> = [];
  const globalFilters: Array<Filter> = [];

  const listen = async (port: number, callback?: () => void) => {
    await container.loadModules(modules);

    const controllers = modules
      .map((m) => Reflect.getMetadata(DECORATORS_KEYS.modules, m)?.controllers)
      .filter(Boolean)
      .flat();

    controllers.forEach((Ctl) => {
      const baseUrl =
        Reflect.getMetadata(DECORATORS_KEYS.controllerBaseUrl, Ctl) ?? '';

      const routes =
        Reflect.getMetadata(DECORATORS_KEYS.controllerRoutes, Ctl) ?? [];

      const CtlInstance = container.resolve<ClassInstance>(Ctl);

      routes.forEach((r: RouteMetadata) => {
        const handler = CtlInstance[r.handlerName];

        const path = baseUrl + r.path;

        // router.get('/books', (req, res) => {});
        (router as any)[r.method](
          path,
          GuardsMiddleware(CtlInstance, handler, globalGuards),
          HandlerMiddleware(CtlInstance, handler, globalPipes),
          FiltersMiddleware(CtlInstance, handler, globalFilters)
        );
      });
    });

    app.listen(port, callback);
  };

  app.use(router);

  return {
    listen,
    useGlobalPipes: (pipes: Pipe[]) => globalPipes.push(...pipes),
    useGlobalGuards: (guards: Guard[]) => globalGuards.push(...guards),
    useGlobalFilters: (filters: Filter[]) => globalFilters.push(...filters),
  };
}

export { Factory };
