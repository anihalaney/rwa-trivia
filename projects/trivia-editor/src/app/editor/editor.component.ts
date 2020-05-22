import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, appState } from './../store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
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
  viewType = 'question';
  bottomBarOptions = '';
  text = '';
  @ViewChild('bottomToolBar', { static: false }) bottomToolBar: ElementRef;

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings[0]) {
        this.applicationSettings = appSettings[0];
        if (this.applicationSettings && this.applicationSettings.quill_options) {
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
          this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };

          if (this.applicationSettings.quill_options.custom_toolbar_position === 'bottom') {
            if (this.viewType === 'question') {
              this.bottomBarOptions = Object.values(this.applicationSettings.quill_options.web_view_question_options).join('');
            } else {
              this.bottomBarOptions = Object.values(this.applicationSettings.quill_options.web_view_answer_options).join('');
            }
          } else {
            if (this.viewType === 'question') {
              this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.web_view_question_options);
            } else {
              this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.web_view_answer_options);
            }
          }
          this.show = true;
        }
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
          this.cd.detectChanges();
        });
      });


      this.oWebViewInterface.on('quillConfig', (quillConfig) => {
        this.ngZone.run(() => {
          this.applicationSettings.quill_options = JSON.parse(quillConfig);
          this.quillConfig.toolbar.container = [];
          this.quillConfig.mathEditor = {};
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.options);
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
          this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };
        });
      });

      this.oWebViewInterface.on('viewType', (viewType) => {
        this.ngZone.run(() => {
          this.viewType = viewType;
          if (this.applicationSettings && this.applicationSettings.quill_options) {
            const dispOptions = Object.keys(this.viewType === 'question' ?
              this.applicationSettings.quill_options.web_view_question_options :
              this.applicationSettings.quill_options.web_view_answer_options);
              Array.from(this.bottomToolBar.nativeElement.children).forEach((ele: any) => {
                const newele = ele as HTMLElement;
                if (dispOptions.indexOf(ele.className) === -1) {
                  newele.style.display = 'none';
                } else {
                  newele.style.display = 'block';
                }
              });
          }
        });
      });
    }
  }

  // emit editor load finished event
  editorLoadFinished(event) {
    this.ngZone.run(() => {
      this.oWebViewInterface.emit('editorLoadFinished', event);
      this.cd.detectChanges();
    });
  }

  // Text change in quill editor
  onTextChanged(text) {
    this.ngZone.run(() => {
      text.answerIndex = this.answerIndex;
      this.oWebViewInterface.emit('quillContent', text);
      this.text = text;
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

  ngOnDestroy() {
    this.oWebViewInterface.off('answerIndex');
    this.oWebViewInterface.off('imageUrl');
    this.oWebViewInterface.off('deltaObject');
    this.oWebViewInterface.off('viewType');
  }

}
