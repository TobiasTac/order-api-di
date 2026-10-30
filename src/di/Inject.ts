export function Inject(token: string) {
  return (target: any, propertyKey: any, propertyIndex: number) => {
    Reflect.defineMetadata(`inject:${propertyIndex}`, token, target);
  };
}
