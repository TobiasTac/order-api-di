import { Constructor } from '../types/utils';

export class Registry {
  private static instance: Registry;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private readonly services: Map<string, Constructor<any>> = new Map();

  private constructor() { }

  register<T>(token: string, implementation: Constructor<T>) {
    if (this.services.has(token)) {
      throw new Error(`"${token}" is already registered`);
    }

    this.services.set(token, implementation);
  }

  resolve<T>(token: string): T {
    const implementation = this.services.get(token);

    if (!implementation) {
      throw new Error(`"${token}" was not found in the registry.`);
    }

    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', implementation) ?? [];
    const dependencies = paramTypes.map((_, index) => {
      const dependencyToken = Reflect.getMetadata(`inject:${index}`, implementation);
      return this.resolve(dependencyToken);
    });

    return new implementation(...dependencies);
  }
}
