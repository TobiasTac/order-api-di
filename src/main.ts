import fastify from 'fastify';
import { SESGateway } from './gateways/SESGateway';
import { SQSGateway } from './gateways/SQSGateway';
import { DynamoOrdersRepository } from './repository/DynamoOrdersRepository';
import { PlaceOrder } from './useCases/PlaceOrder';

const app = fastify();

app.post('/orders', async (request, reply) => {
  const dynamoOrdersRepository = new DynamoOrdersRepository();
  const sqsGateway = new SQSGateway();
  const sesGateway = new SESGateway();
  
  const placeOrder = new PlaceOrder(
    dynamoOrdersRepository,
    sqsGateway,
    sesGateway,
  );

  const { orderId } = await placeOrder.execute();

  reply.status(201).send({ orderId });
});

app.listen({ port: 3000 })
  .then(() => {
    console.log('> Server started at http://localhost:3000');
  });
