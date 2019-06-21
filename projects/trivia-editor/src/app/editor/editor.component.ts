import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, appState } from './../store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ApplicationSettings } from 'shared-library/shared/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class EditorComponent implements OnInit, OnDestroy {

  editorContent = [{ insert: '' }];
  applicationSettings: ApplicationSettings;
  show = false;
  quillImageUrl = '';
  answerIndex: number;
  public oWebViewInterface = (window as any).nsWebViewInterface;
  quillConfig = {
    toolbar: {
      container: [],
      handlers: {
        // handlers object will be merged with default handlers object
        'mathEditor': () => {
        }
      }
    },
    mathEditor: {},
    blotFormatter: {},
    syntax: true
  };
  subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings[0]) {
        this.applicationSettings = appSettings[0];
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.options);
        this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
        this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };
        this.show = true;
      }
    }));
  }

  ngOnInit() {

    if (this.oWebViewInterface) {
      this.oWebViewInterface.on('answerIndex', (answerIndex) => {
        this.ngZone.run(() => {
          this.answerIndex = answerIndex;
          this.cd.detectChanges();
        });
      });

      this.oWebViewInterface.on('imageUrl', (url) => {
        this.ngZone.run(() => {
          this.quillImageUrl = url;
        });
      });

      this.oWebViewInterface.on('deltaObject', (deltaObject) => {
        this.ngZone.run(() => {
          this.editorContent = deltaObject;
        });
      });
    }
  }

  // Text change in quill editor
  onTextChanged(text) {
    this.ngZone.run(() => {
      text.answerIndex = this.answerIndex;
      this.oWebViewInterface.emit('quillContent', text);
      this.cd.detectChanges();
    });

  }

  // Image Upload
  fileUploaded(quillImageUpload: any) {
    if (quillImageUpload.isMobile) {
      this.oWebViewInterface.emit('uploadImageStart', true);
    }
  }

  imageUpload() {
    this.oWebViewInterface.emit('uploadImageStart', true);
  }

  ngOnDestroy() { }

}
