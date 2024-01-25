import { Injectable } from '@angular/core';
import { CustomChangeDetectorService } from './changeDetector.service';

@Injectable()
export class EventZonelessDetectChanges {
  private _splitEvent(eventName: string): [string, string] {
    const prefix = eventName.substring(0, 1);
    const event = eventName.substring(1);
    return [prefix, this.camelCase(event)];
  }

  constructor(private _cd: CustomChangeDetectorService) {}

  supports(eventName: string): boolean {
    return true;

  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ): Function {
    const [_, event] = this._splitEvent(eventName);

    const monkeyPatchHandler = (...args: any) => {
      handler.apply(element, args);
      this._cd.detectChanges(element);
    };

    element.addEventListener(
      event,
      monkeyPatchHandler as EventListener,
      false
    );
    return () =>
      this.removeEventListener(
        element,
        event,
        monkeyPatchHandler as EventListener
      );
  }

  removeEventListener(
    target: any,
    eventName: string,
    callback: Function
  ): void {
    const [_, eventRealName] = this._splitEvent(eventName);
    return target.removeEventListener(eventRealName, callback as EventListener);
  }

  camelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }
}
