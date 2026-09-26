import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import { Order } from '../entities/Order';

export class DynamoOrdersRepository {
  private client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async create(order: Order): Promise<void> {
    const putItemCommand = new PutCommand({
      TableName: 'Orders',
      Item: order,
    });
    await this.client.send(putItemCommand);
  }
}
