import { getBody } from '@/utils/body';
import { response } from '@/utils/response';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognito-client';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email } = getBody(event.body);

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    });

    await cognitoClient.send(command);

    return response(204);
  } catch (error) {
    return response(500, {
      error: 'Something went wrong',
    });
  }
}
