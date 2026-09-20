export class NotAllowedError extends Error {
  constructor(message?: string) {
    super(`Not Allowed. ${message}`);
  }
}