import { cognitoClient } from '@/libs/cognito-client';
import { response } from '@/utils/response';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const user_id = event.requestContext.authorizer.jwt.claims.sub;

  const command = new AdminGetUserCommand({
    Username: user_id as string,
    UserPoolId: process.env.COGNITO_POOL_ID,
  });

  const { UserAttributes } = await cognitoClient.send(command);

  const profile = UserAttributes?.reduce(
    (prev, { Name, Value }) => ({
      ...prev,
      [String(Name)]: Value,
    }),
    {}
  );

  return response(200, {
    profile,
  });
}
