import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { CommonModule } from "@angular/common";
// import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
// import { DrawerComponent } from "~/drawer/drawer-component";
import { DashboardRoutingModule } from "../dashboard/dashboard.routing";
import { HomeComponent } from "./home/home.component";
import { SharedModule } from "./../../shared";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
// registerElement("CardView", () => require("nativescript-cardview").CardView);
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);
@NgModule({
    imports: [
        DashboardRoutingModule,
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        CommonModule,
        SharedModule,
        NativeScriptUISideDrawerModule
    ],
    declarations: [
        HomeComponent,
        // DrawerComponent
    ],
    providers: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class DashboardModule { }