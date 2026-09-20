export class EmailAlreadyExistError extends Error {
  constructor(message?: string) {
    super(`Email already exists. ${message}`);
  }
}