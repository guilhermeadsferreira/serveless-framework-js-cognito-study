import { getBody } from '@/utils/body';
import { response } from '@/utils/response';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  ConfirmSignUpCommand,
  CodeMismatchException,
  ExpiredCodeException,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognito-client';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email, code } = getBody(event.body);

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });

    await cognitoClient.send(command);

    return response(204);
  } catch (error) {
    if (error instanceof CodeMismatchException) {
      return response(400, {
        error: 'Invalid confirmation code',
      });
    }

    if (error instanceof ExpiredCodeException) {
      return response(400, {
        error: 'Confirmation code expired',
      });
    }

    return response(500, {
      error: 'Something went wrong',
    });
  }
}
