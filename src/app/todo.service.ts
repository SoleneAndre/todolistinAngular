import { Injectable } from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {TodoItemData} from './dataTypes/TodoItemData';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {  AgmMap, MapsAPILoader} from '@agm/core';
import {  ViewChild, NgZone} from '@angular/core';
import {  GoogleMapsAPIWrapper } from '@agm/core';
import { stringify } from '@angular/compiler/src/util';

declare var google: any;

@Injectable()
export class TodoService {
  @ViewChild(AgmMap, {static: false}) map: AgmMap;

  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: [] });
  AnnulerRetablir: [TodoItemData[]] = [[]];
  indexAR = 0;
  private geocoder: any;

  constructor(public mapsApiLoader: MapsAPILoader,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper) {
  this.mapsApiLoader = mapsApiLoader;
  this.zone = zone;
  this.wrapper = wrapper;
  this.mapsApiLoader.load().then(() => {
  this.geocoder = new google.maps.Geocoder();
});
    this.todoListSubject.value.items = this.getLocalStorageItemsTodolist();
    this.AnnulerRetablir[0] = this.todoListSubject.value.items ;
   }
     // Observable est l'objet de la programmation réactive il va pouvoir creer des observables.
   getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  } // on rend la todolist observable grace a la methode

  // on enregistre la map google map dans le local storage
  setLocalStoragemapTodolist(map: TodoItemData[]): void {
    localStorage.setMap('map', JSON.stringify({ map: map }));
  }
  // on recupere la map google map situe dans le local storage
  getLocalStoragemapTodolist() {
    const localStorageMap = JSON.parse(localStorage.getMap('map'));
    return localStorageMap == null ? [] : localStorageMap.map;

  }

  // on recupere l'attribut ville dans le local storage
  setlocalStoragevillemap(adresse: string) {
  localStorage.setItem('ville', JSON.stringify('https://www.google.com/maps/search/?api=1&query=' + adresse));
}

  // on enregistre l'attribut ville dans le local storage
getlocalStoragevillemap() {
  return JSON.parse(localStorage.getItem('ville'));
}

 // on enregistre le tableau d'item dans le local storage
  setLocalStorageItemsTodolist(items: TodoItemData[] ): void {
    localStorage.setItem('items', JSON.stringify({ items: items }));
  }

 // on recupere le tableau d'item dans le local storage
  getLocalStorageItemsTodolist(): TodoItemData[] {
    const localStorageItem = JSON.parse(localStorage.getItem('items'));
    return localStorageItem == null ? [] : localStorageItem.items;
  }

   // on enregistre les todo via un label et un tabelau d'item
  setTodosLabel(label: string, ... items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, check: I.check, location:
        {
          lat: 50.1,
          lng: 5.7,
          viewport: Object,
          zoom: 5,
          marker : {
            lat: 50.1,
            lng: 5.7,
            draggable: true
          }
        }, map : new google.maps.Geocoder(),
        ville : ''
    }
        )
    )});
      this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    this.ajouterannulretablirAction(this.todoListSubject.value.items);
  }

// methode pour annuler l'action qu'on a faite
  Actionannuler(): void {
    console.log('Ctrl + Z ' + this.indexAR ); // J'affiche control Z qui signifie l annulation de l item
    if (this.indexAR > 0) {
      this.indexAR--;
      this.todoListSubject.value.items = this.AnnulerRetablir[this.indexAR];
      this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    }

  }
// methode pour retablir ce qu on a annulé
  Actionretablir(): void {
    console.log('Ctrl + Y ' + this.indexAR ); // J'affiche control Y qui signifie la restauration de l item
    if (this.AnnulerRetablir.length > this.indexAR + 1) {
      this.indexAR++;
      this.todoListSubject.value.items = this.AnnulerRetablir[this.indexAR];
      this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    }
  }

// on enregistre la methode et on recupere les actions precedantes
  ajouterannulretablirAction(items: TodoItemData[] ) {
    if ( typeof items !== 'undefined') { // si il existe un tableau d'item
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
// on enregistre l'item coché
  setTodosCheck(check: boolean, annulretablir: boolean, ... items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, check,
        location:
        {
          lat: 50.1,
          lng: 5.7,
          viewport: Object,
          zoom: 5,
          marker : {
            lat: 50.1,
            lng: 5.7,
            draggable: true
          }
        }, map : new google.maps.Geocoder(),
        ville : ''
    }) ) });
    }
// si le undo redo est true on met a jour le local storage et on fait appel a la methode annulretablirAction
    if (annulretablir) {
      this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
      this.ajouterannulretablirAction(this.todoListSubject.value.items);
    }
    // ajouter des todos
  addTodos( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      ...tdl,
      items: [...tdl.items, ...items]

    });
    this.setLocalStorageItemsTodolist(this.todoListSubject.value.items);
    this.ajouterannulretablirAction(this.todoListSubject.value.items);
  }

// supprimer les item cochés
  SuppTodosCoche( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
    this.ajouterannulretablirAction(this.todoListSubject.value.items);
  }

// supprimer via le bouton supprimer une todo
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

