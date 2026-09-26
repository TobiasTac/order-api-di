import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Order } from '../entities/Order';

export class PlaceOrder {
  async execute() {
    const customerEmail = 'tobias.vida@live.com';
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient());
    const putItemCommand = new PutCommand({
      TableName: 'Orders',
      Item: order,
    });
    await ddbClient.send(putItemCommand);

    const sqsClient = new SQSClient();
    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/564111475414/ProcessPaymentQueue',
      MessageBody: JSON.stringify({ orderId: order.id }),
    });
    await sqsClient.send(sendMessageCommand);

    const sesClient = new SESClient({ region: 'sa-east-1' });
    const sendEmailCommand = new SendEmailCommand({
      Source: 'TACStore <noreply@tobiasac.dev.br>',
      Destination: {
        ToAddresses: [customerEmail],
      },
      Message: {
        Subject: {
          Charset: 'utf-8',
          Data: `Pedido ${order.id} confirmado!`,
        },
        Body: {
          Html: {
            Charset: 'utf-8',
            Data: `
              <h1> E aí, Tobias!</h1>

              <p> Passando aqui só pra avisa que o seu pedido já foi confirmado e em breve você receverá a confirmação do pagamento e a nota fiscal aqui no seu e-mail!</p>

              <small> {{ tabela com os itens do pedido }} </small>
            `
          },
        }
      }
    });
    await sesClient.send(sendEmailCommand);

    return { orderId: order.id };
  }
}
