import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import {TodoListData} from '../dataTypes/TodoListData';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  @Input() private data: TodoItemData;
  private edite = false;
  @ViewChild('inputData', {static: false}) newTextInput: ElementRef;

  constructor(private todoService: TodoService) { }

  ngOnInit() {}

getedite(): boolean {
    return this.edite;
  }
setedite(valeur: boolean) {
    this.edite = valeur;
    if (valeur) {
      requestAnimationFrame(
        () => this.newTextInput.nativeElement.focus());
    }

  }

  getlabel(): string {
  return this.data.label;
  }

  setlabel(label: string) {
    this.todoService.setTodosLabel(label, this.data);
    }

  getIsCheck(): boolean {
  return this.data.check;
  }

  setIsCheck(check: boolean) {
this.todoService.setTodosCheck(check, true, this.data);
  }

  supprimer() {
this.todoService.supprimerTodos(true, this.data);
  }

  editeItem(value: string) {
    value.trim();
    if (value !== '' ) {
    this.setlabel(value);
    this.edite = false;
     } else {
    this.setlabel(this.data.label);
    this.edite = false;
  }
  }

  QuitterEdite(value: string) {

    this.setlabel(this.data.label);
    this.edite = false;
}

}
