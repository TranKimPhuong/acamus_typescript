export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private timestamp(): string {
    return new Date().toISOString();
  }

  info(message: string): void {
    console.log(`[${this.timestamp()}] [INFO] [${this.context}] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[${this.timestamp()}] [WARN] [${this.context}] ${message}`);
  }

  error(message: string, error?: unknown): void {
    console.error(`[${this.timestamp()}] [ERROR] [${this.context}] ${message}`, error ?? '');
  }

  step(message: string): void {
    console.log(`[${this.timestamp()}] [STEP] [${this.context}] >> ${message}`);
  }
}
