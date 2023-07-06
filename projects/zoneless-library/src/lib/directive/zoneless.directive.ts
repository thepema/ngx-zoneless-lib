
import {
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    NgZone,
    TemplateRef,
    ViewContainerRef,
  } from '@angular/core';
  
  @Directive({
    selector: '[zoneLess]',
  })
  export class ZoneLessDirective implements AfterViewInit {
    constructor(
      private readonly _templateRef: TemplateRef<any>,
      private readonly _viewContainer: ViewContainerRef,
      private readonly _ngzone: NgZone,
      private readonly _cd: ChangeDetectorRef
    ) {
      if(!(_ngzone instanceof NgZone)) {
        throw new Error('Need the project be in Zone')
      }
    }
  
    ngAfterViewInit() {
      setTimeout(() => {
        this._ngzone.runOutsideAngular(() => {
          this._viewContainer.createEmbeddedView(this._templateRef);
        });
        this._cd.detectChanges();
      })
    }
  }