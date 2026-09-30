import { Order } from '../entities/Order';

import type { IEmailGateway } from '../interfaces/gateways/IEmailGateway';
import type { IQueueGateway } from '../interfaces/gateways/IQueueGateway';
import type { IOrdersRepository } from '../interfaces/repositories/IOrdersRepository';

export class PlaceOrder {
  constructor(
    private readonly dynamoOrdersRepository: IOrdersRepository,
    private readonly queuGateway: IQueueGateway,
    private readonly emailGateway: IEmailGateway,
  ) {}
  async execute() {
    const customerEmail = 'tobias.vida@live.com';
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    await this.dynamoOrdersRepository.create(order);
    await this.queuGateway.publishMessage({ orderId: order.id });
    await this.emailGateway.sendEmail({
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
