import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import {TodoService} from './todo.service';
import {FormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent
  ],
  imports: [
    BrowserModule, FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD3DfSPdWQKM2eqIN6PGpaR979Hz3NjSWs'
    }),
    NgbModule
  ],
  providers: [TodoService, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
