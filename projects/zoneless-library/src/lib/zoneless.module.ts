import { NgModule } from '@angular/core';
import { ZoneLessDirective } from './directive/zoneless.directive';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { EventZonelessDetectChanges } from './services/EventZonelessDetectChanges.service';
import { AsyncPipeZoneless } from './pipes/custom-async.pipe';

@NgModule({
  declarations: [ZoneLessDirective, AsyncPipeZoneless],
  exports: [ZoneLessDirective, AsyncPipeZoneless],
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      multi: true,
      useClass: EventZonelessDetectChanges,
    }
  ],
})
export class ZonelessModule {}
