import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TodoService} from './todo.service';
import {TodoListData} from './dataTypes/TodoListData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private todolist: TodoListData;
constructor(private todoService: TodoService) {
todoService.getTodoListDataObserver().subscribe(
L => this.todolist = L
);
}
getTodolistCourante(): TodoListData {
  return this.todolist;
}

Retablir(): void {
  this.todoService.Actionannuler();
}
Annuler(): void {
  this.todoService.Actionretablir();
}
}
