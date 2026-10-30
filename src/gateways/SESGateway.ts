import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import type { IEmailGateway, ISendEmailParams } from '../interfaces/gateways/IEmailGateway';

export class SESGateway implements IEmailGateway {
  private client = new SESClient({ region: 'sa-east-1' });

  async sendEmail({ from, to, subject, html }: ISendEmailParams): Promise<void> {

    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Charset: 'utf-8',
          Data: subject,
        },
        Body: {
          Html: {
            Charset: 'utf-8',
            Data: html
          },
        }
      }
    });
    await this.client.send(command);
  }
}
