import { getBody } from '@/utils/body';
import { response } from '@/utils/response';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import {
  InvalidPasswordException,
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognito-client';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = getBody(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        {
          Name: 'given_name',
          Value: body.firstName,
        },
        {
          Name: 'family_name',
          Value: body.lastName,
        },
      ],
    });

    const { UserSub } = await cognitoClient.send(command);

    return response(201, {
      user: {
        id: UserSub,
      },
    });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(409, {
        error: 'This email is already in use',
      });
    }

    if (error instanceof InvalidPasswordException) {
      return response(400, {
        error: 'Invalid password',
      });
    }

    return response(500, {
      error: 'Something went wrong',
    });
  }
}
