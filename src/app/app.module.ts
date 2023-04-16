import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DependencyGraphComponent } from './dependency-graph/dependency-graph.component';


@NgModule({
  declarations: [
    AppComponent, DependencyGraphComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
