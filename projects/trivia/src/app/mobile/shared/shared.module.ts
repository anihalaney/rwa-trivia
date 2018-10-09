import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { LoginComponent } from "./../components/login/login.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
    ],
    exports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        LoginComponent
    ],
    declarations: [
        LoginComponent
    ],

    entryComponents: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class MobileSharedModule { }
