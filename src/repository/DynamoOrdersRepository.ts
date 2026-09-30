import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import type { Order } from '../entities/Order';
import type { IOrdersRepository } from '../interfaces/repositories/IOrdersRepository';

export class DynamoOrdersRepository implements IOrdersRepository {
  private client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async create(order: Order): Promise<void> {
    const putItemCommand = new PutCommand({
      TableName: 'Orders',
      Item: order,
    });
    await this.client.send(putItemCommand);
  }
}
