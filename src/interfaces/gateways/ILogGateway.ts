export interface ILogGateway {
  log(logMessage: Record<string, unknown>): Promise<void>;
}
