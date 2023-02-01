import { NgModule } from "@angular/core";
import { SanitizerUrlPipe } from "./pipe/sanitizer-url.pipe";

@NgModule({
    imports: [],
    declarations: [ SanitizerUrlPipe ],
    exports: [ SanitizerUrlPipe ]
  })
  export class SharedModule { }