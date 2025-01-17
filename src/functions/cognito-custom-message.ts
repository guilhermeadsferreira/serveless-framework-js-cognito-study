import { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  const name = event.request?.userAttributes.given_name;
  const email = event.request?.userAttributes.email;
  const code = event.request?.codeParameter;

  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response.emailSubject = `Bem-vindo(a) ${name}`;
    event.response.emailMessage = `<h1>Seja muito bem-vindo(a) ${name}</h1><br/><br/>Use este código para confirmar sua conta: ${code}`;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Recuperação de conta';
    event.response.emailMessage = `<h1>Para recuperar a sua conta acesse:</h1> <strong>https://example.com/auth/forgot-password?email=${encodeURIComponent(
      email
    )}&code=${code}</strong>`;
  }

  return event;
}
