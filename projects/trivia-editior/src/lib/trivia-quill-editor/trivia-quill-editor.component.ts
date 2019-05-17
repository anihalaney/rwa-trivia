import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-trivia-quill-editor',
  templateUrl: './trivia-quill-editor.component.html',
  styleUrls: ['./trivia-quill-editor.component.scss']
})
export class TriviaQuillEditorComponent implements OnInit, OnChanges {

  @Input() modules;
  @Input() _imageUrl;
  @Output() quillHtml = new EventEmitter<any>();
  @Output() quillDelta = new EventEmitter<any>();
  @Output() fileuploaded = new EventEmitter<any>();


  @ViewChild('quillEditior') quillEditior: QuillEditorComponent;
  constructor() { }

  ngOnInit() {
    console.log('settings> ', this.modules);

    this.modules.imageUpload = {
      customUploader: (file) => {
        console.log('image uploaded');
        console.log('file uploaded', file);
        this.onfileuploaded(file);
      }
    };

    setTimeout(() => {
      this.quillEditior
        .onContentChanged
        .pipe(
          debounceTime(400),
        )
        .subscribe((data) => {
          this.onquillHtml(data.html);
          this.onquillDelta(data.content.ops);
        });
    }, 0);
  }

  onquillHtml(html: any) {
    this.quillHtml.emit(html);
  }

  onquillDelta(delta: any) {
    this.quillHtml.emit(delta);
  }

  onfileuploaded(file: File): void {
    this.fileuploaded.emit(file);
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('sample changes', changes);
  }

  get imageUrl(): string {
    // transform value for display
    return this._imageUrl;
  }

  @Input()
  set imageUrl(fileName: string) {
    console.log('prev value: ', this._imageUrl);
    console.log('got name: ', fileName);
    this._imageUrl = fileName;
  }

}
