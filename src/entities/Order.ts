import { randomUUID } from 'node:crypto';

export class Order {
  public id: string;

  constructor(readonly email: string, public amount: number) {
    this.id = randomUUID();
  }
}
