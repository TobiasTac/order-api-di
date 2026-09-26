import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Order } from '../entities/Order';
import { SQSGateway } from '../gateways/SQSGateway';
import { DynamoOrdersRepository } from '../repository/DynamoOrdersRepository';

export class PlaceOrder {
  async execute() {
    const customerEmail = 'tobias.vida@live.com';
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);
    const dynamoOrdersRepository = new DynamoOrdersRepository();
    const sqsGateway = new SQSGateway();


    await dynamoOrdersRepository.create(order);
    await sqsGateway.publishMessage({ orderId: order.id });

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
