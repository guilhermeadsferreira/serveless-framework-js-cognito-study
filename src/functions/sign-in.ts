import { cognitoClient } from '@/libs/cognito-client';
import { getBody } from '@/utils/body';
import { response } from '@/utils/response';
import {
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email, password } = getBody(event.body);

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
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
      refreshToken: AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    if (
      error instanceof UserNotFoundException ||
      error instanceof NotAuthorizedException
    ) {
      return response(401, {
        error: 'Invalid credentials',
      });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, {
        error: 'You need to confirm your email',
      });
    }

    return response(500, {
      error: 'Something went wrong',
    });
  }
}
