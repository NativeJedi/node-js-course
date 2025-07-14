import { ClassType, isClassType } from './types';
import DECORATORS_KEYS from './decorators/keys';
import {
  isUseClassProvider,
  isUseValueProvider,
  ModuleData,
} from './decorators/module';

const getDependenciesForInjection = <T>(
  targetClass: ClassType<T>
): Array<ClassType<T>> =>
  Reflect.getMetadata('design:paramtypes', targetClass) || [];

type Token<T = unknown> = ClassType<T> | string;

export class Container {
  private providers = new Map<Token, any>();
  private singletons = new Map<Token, any>();

  register<T>(token: Token<T>, provider?: T) {
    this.providers.set(token, provider || token);
  }

  async loadModules(modules: ClassType[]) {
    const loadModulesPromises = modules.map((module) =>
      this.loadModule(module)
    );
    await Promise.all(loadModulesPromises);
  }

  async loadModule(moduleClass: ClassType) {
    const modulesMeta: ModuleData = Reflect.getMetadata(
      DECORATORS_KEYS.modules,
      moduleClass
    );

    await this.loadModules(modulesMeta?.imports || []);

    modulesMeta?.controllers?.forEach((controller) =>
      this.register(controller)
    );

    modulesMeta.providers?.forEach((provider) => {
      if (isUseClassProvider(provider)) {
        this.register(provider.token, provider.useClass);
      } else if (isUseValueProvider(provider)) {
        this.register(provider.token, provider.useValue);
      } else {
        this.register(provider);
      }
    });
  }

  resolve<T>(token: Token<T>): T {
    if (this.singletons.has(token)) return this.singletons.get(token);

    const Provider = this.providers.get(token);

    if (!Provider)
      throw new Error(`No provider for token ${(token as any)?.name ?? token}`);

    // Check if the provider is a class type or a value
    if (!isClassType<T>(Provider)) {
      this.singletons.set(token, Provider);
      return Provider;
    }

    const depsForInjection = getDependenciesForInjection<T>(Provider);

    const injectTokens =
      Reflect.getMetadata(DECORATORS_KEYS.injectTokens, Provider) || {};

    const deps = depsForInjection.map((param, index) => {
      // Replace an injection argument with the token if it exists
      const depToken = injectTokens[index] || param;

      return this.resolve(depToken);
    });

    const instance = new Provider(...deps);

    // only singletons are supported for now
    this.singletons.set(token, instance);

    return instance;
  }
}

const container = new Container();

export { container, Token };
