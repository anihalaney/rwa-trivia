import { NgModule } from '@angular/core';
import { TriviaEditiorComponent } from './trivia-editior.component';
import { TriviaQuillEditorComponent } from './trivia-quill-editor/trivia-quill-editor.component';
import { QuillModule } from 'ngx-quill';
import { QuillInitializeService } from './services/quillInitialize.service';

@NgModule({
  declarations: [TriviaEditiorComponent, TriviaQuillEditorComponent],
  imports: [QuillModule],
  exports: [TriviaEditiorComponent, TriviaQuillEditorComponent],
  providers: [QuillInitializeService]
})
export class TriviaEditiorModule { }
