
type Constructor<T> = new (...args: any[]) => T;

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

  register<T>(implementation: Constructor<T>) {
    const token = implementation.name;

    if (this.services.has(token)) {
      throw new Error(`"${token}" is already registered`);
    }

    this.services.set(implementation.name, implementation);

  }

  resolve() { }
}
