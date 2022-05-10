import { ErrorHandler, Injectable, Injector, Inject, PLATFORM_ID } from "@angular/core";
import { LoggingService } from "./logging/logging.service";
import { isPlatformBrowser } from '@angular/common'
import { NotificationService } from "./notification/notification.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector, @Inject(PLATFORM_ID) private platform: Object) { }

  handleError(error: any): void {
    if (isPlatformBrowser(this.platform)) {
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
}
