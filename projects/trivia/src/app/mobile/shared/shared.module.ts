import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { LoginComponent } from "./../components/login/login.component";

// Declare Pipe Here
import { ActionBarComponent } from "./action-bar/action-bar.component";
import { DrawerComponent } from './drawer-component/drawer-component';


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
        ActionBarComponent,
        DrawerComponent,
        LoginComponent
    ],
    declarations: [
        ActionBarComponent,
        DrawerComponent,
        LoginComponent
    ],

    entryComponents: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class MobileSharedModule { }
