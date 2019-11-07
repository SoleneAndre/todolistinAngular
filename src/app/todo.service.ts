import { Injectable } from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {TodoItemData} from './dataTypes/TodoItemData';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TodoService {

  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: [] });
  AnnulerRetablir: [TodoItemData[]] = [[]];
  indexAR = 0;

  constructor() {
    this.todoListSubject.value.items = this.getLocalStorageItemsTodolist();
    this.AnnulerRetablir[0] = this.todoListSubject.value.items ;
   }

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  setLocalStorageItemsTodolist(items: TodoItemData[] ): void {
    localStorage.setItem('items', JSON.stringify({ items: items }));
  }

  getLocalStorageItemsTodolist(): TodoItemData[] {
    const localStorageItem = JSON.parse(localStorage.getItem('items'));
    return localStorageItem == null ? [] : localStorageItem.items;
  }

  setTodosLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, check: I.check}) )
    });
    this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    this.ajouterannulretablirAction(this.todoListSubject.value.items);
  }

  Actionannuler(): void {
    console.log('Ctrl + Z ' + this.indexAR ); // J'affiche control Z qui signifie l annulation de l item
    if (this.indexAR > 0) {
      this.indexAR--;
      this.todoListSubject.value.items = this.AnnulerRetablir[this.indexAR];
      this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    }

  }

  Actionretablir(): void {
    console.log('Ctrl + Y ' + this.indexAR ); // J'affiche control Y qui signifie la restauration de l item
    if (this.AnnulerRetablir.length > this.indexAR + 1) {
      this.indexAR++;
      this.todoListSubject.value.items = this.AnnulerRetablir[this.indexAR];
      this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    }
  }
  ajouterannulretablirAction(items: TodoItemData[] ) {
    if ( typeof items !== 'undefined') {

      if (this.indexAR + 1 < this.AnnulerRetablir.length ) {
        const buf: [TodoItemData[]] = [[]];
        for (let i = 0; i <= this.indexAR ; i++) {
            buf[i] = this.AnnulerRetablir[i];
        }
        this.AnnulerRetablir = buf;
      }

      this.AnnulerRetablir.push(this.todoListSubject.value.items);
      this.indexAR++;
    }

  }
  setTodosCheck(check: boolean, annulrefaire: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, check}) )
    });

    if (annulrefaire) {
      this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
      this.ajouterannulretablirAction(this.todoListSubject.value.items);
    }
  }
  addTodos( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      ...tdl,
      items: [...tdl.items, ...items]

    });
    this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    this.ajouterannulretablirAction(this.todoListSubject.value.items);
  }

  SuppTodosCoche( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
    this.ajouterannulretablirAction(this.todoListSubject.value.items);

  }
  supprimerTodos(AnnulerRetablir: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });

   AnnulerRetablir ?
    this.setLocalStorageItemsTodolist(this.todoListSubject.value.items) :
    this.ajouterannulretablirAction(this.todoListSubject.value.items);
    }
  }

