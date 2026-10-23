import { SESGateway } from '../gateways/SESGateway';
import { SQSGateway } from '../gateways/SQSGateway';
import { DynamoOrdersRepository } from '../repository/DynamoOrdersRepository';
import { Registry } from './Registry';

export const container = Registry.getInstance();

container.register(DynamoOrdersRepository);
container.register(SQSGateway);
container.register(SESGateway);
