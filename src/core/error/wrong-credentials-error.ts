export class WrongCredentialsError extends Error {
  constructor(message?: string) {
    super(`Wrong Credentials. ${message}`);
  }
}