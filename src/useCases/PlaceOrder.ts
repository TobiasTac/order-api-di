import { Order } from '../entities/Order';
import { SESGateway } from '../gateways/SESGateway';
import { SQSGateway } from '../gateways/SQSGateway';
import { DynamoOrdersRepository } from '../repository/DynamoOrdersRepository';

export class PlaceOrder {
  constructor(
    private readonly dynamoOrdersRepository: DynamoOrdersRepository,
    private readonly sqsGateway: SQSGateway,
    private readonly sesGateway:SESGateway,
  ) {}
  async execute() {
    const customerEmail = 'tobias.vida@live.com';
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    await this.dynamoOrdersRepository.create(order);
    await this.sqsGateway.publishMessage({ orderId: order.id });
    await this.sesGateway.sendEmail({
      from: 'TACStore <noreply@tobiasac.dev.br>',
      to: [customerEmail],
      subject: `Pedido ${order.id} confirmado!`,
      html: `
              <h1> E aí, Tobias!</h1>
              <p> Passando aqui só pra avisa que o seu pedido já foi confirmado e em breve você receverá a confirmação do pagamento e a nota fiscal aqui no seu e-mail!</p>
              <small> {{ tabela com os itens do pedido }} </small>
      `,
    });

    return { orderId: order.id };
  }
}
