import { LoginPayloadDto } from '../auth/dto/loginPayload.dto';

export function authorizationToLoginPayload(
  authorization: string,
): LoginPayloadDto {
  const splitAuthorization = authorization.split('.');

  if (splitAuthorization.length < 3 || !splitAuthorization[1]) {
    return undefined;
  }

  return JSON.parse(
    Buffer.from(splitAuthorization[1], 'base64').toString('ascii'),
  );
}
