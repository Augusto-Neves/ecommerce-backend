import { UpdatePasswordDto } from '../dtos/updatePassword.dto';

export const updatePasswordMock: UpdatePasswordDto = {
  lastPassword: 'wqeyguia1689qqhbgt1u768687h',
  newPassword: 'my new password',
};

export const updatePasswordInvalidMock: UpdatePasswordDto = {
  lastPassword: 'test password',
  newPassword: 'my new password',
};
