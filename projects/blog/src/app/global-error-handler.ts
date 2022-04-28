import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { LoggingService } from "./logging/logging.service";
import { NotificationService } from "./notification/notification.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any): void {
    const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificationService);

    let message = "";
    let stackTrace = "";

    message = error.message ?? error.toString();
    stackTrace = error.stack ?? "";

    notifier.showError(message, stackTrace);
    logger.logError(message, stackTrace);
    console.error(error);
  }
}
