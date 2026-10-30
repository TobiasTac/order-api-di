import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import { Inject } from '../di/Inject';
import type { Order } from '../entities/Order';
import type { ILogGateway } from '../interfaces/gateways/ILogGateway';
import type { IOrdersRepository } from '../interfaces/repositories/IOrdersRepository';

export class DynamoOrdersRepository implements IOrdersRepository {
  private client = DynamoDBDocumentClient.from(new DynamoDBClient());

  constructor(
    @Inject('LogGateway') private readonly logGateway: ILogGateway
  ) { }

  async create(order: Order): Promise<void> {
    const putItemCommand = new PutCommand({
      TableName: 'Orders',
      Item: order,
    });

    await this.logGateway.log({ ...order });

    await this.client.send(putItemCommand);
  }
}
