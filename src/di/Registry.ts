type Constructor<T> = new (...args: any[]) => T;

export class Registry {
  private readonly services: Map<string, Constructor<any>> = new Map();

  register<T>(implementation: Constructor<T>) {
    const token = implementation.name;

    if (this.services.has(token)) {
      throw new Error(`"${token}" is already registered`);
    }

    this.services.set(implementation.name, implementation);
  }
}
