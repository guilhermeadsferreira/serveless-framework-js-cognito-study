import { cognitoClient } from '@/libs/cognito-client';
import { getBody } from '@/utils/body';
import { response } from '@/utils/response';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { refreshToken } = getBody(event.body);

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, {
        error: 'Invalid credentials',
      });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
    });
  } catch {
    return response(500, {
      error: 'Something went wrong',
    });
  }
}
