/// <reference types="@types/googlemaps" />
import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import { TodoService } from '../todo.service';
import { MouseEvent } from '@agm/core';
import { Marker } from '../marker';


type FonctionFiltreItem = (item: TodoItemData) => boolean;
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})


export class TodoListComponent implements OnInit {
  @ViewChild('gSearch', {static: false}) formSearch;
  @ViewChild('searchKey', {static: false}) hiddenSearchHandler;
  lat = 51.678418;
  lng = 7.809007;
  // google maps zoom level
  zoom = 8;

  @Input()
  private data: TodoListData;
  private filtre: string;
  private edite = false;
  private dataitem: TodoItemData;
  private suppcacheEdite: string;
  itemLabel: any;
 markers: Marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: '1',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: '2',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: '3',
      draggable: true
    }
  ];

  constructor(private todoService: TodoService) { }
  filterCheck: FonctionFiltreItem = item => item.check;
  filterUnCheck: FonctionFiltreItem = item => !item.check;
  filterAll: FonctionFiltreItem = () => true;
  // tslint:disable-next-line: member-ordering
  filtreCourant: FonctionFiltreItem = this.filterAll;

  ngOnInit() {
    this.filtre = 'toutes';
  }

  getlabel(): string {
    return this.data ? this.data.label : '';
  }

  getitems(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }

  addTodo(todoLabel: string) {
    if (todoLabel) {
     const val = confirm('Voulez-vous ajouter une localisation?');
       if (val === true) {
      const adresse = prompt('Ville de la nouvelle TODO :)', '');
              // Si l'adresse n'est pas vide
      if (adresse !== '') {
        const geocoder =  new google.maps.Geocoder(); // On instancie le geocoder
      geocoder.geocode( { 'address': adresse}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) { // Si l'adresse a été résolue
        console.log('Geocoding complete!');
        console.log(this.lat);
        console.log(this.lng);


} else {
            alert(' Quelque chose ne va pas' + status);
        }
        this.lat  = results[0].geometry.location.lat(),
        this.lng = results[0].geometry.location.lng();

  });
  this.markers.push({
    lat: this.lat,
    lng: this.lng,
    label: '',
    draggable: true
});

  }
}
this.todoService.addTodos({
  label: todoLabel, check: false
});
  }
}

  setTodoCheck(item: TodoItemData, check: boolean, edite: boolean) {
    this.todoService.setTodosCheck(check, true, item);
  }

  changeCheck() {
    const check = !this.tousCheck();
    let AnnulerRetablir = false;
    for (let i = 0; i < this.data.items.length; i++ ) {
      if (i === this.data.items.length - 1) {
        AnnulerRetablir = true;
      }
      this.todoService.setTodosCheck(check, AnnulerRetablir, this.data.items[i] );
  }
  }
/* TodoCheck(): number {
    return this.data.items.reduce(
      (acc, item) => acc + (item.check ? 1 : 0), 0);
  }
 TodoUncheck(): number {
    return this.data.items.reduce(
      (acc, item) => acc + (item.check ? 0 : 1), 0 );
  }*/
  tousCheck(): boolean {
    return this.getitems().reduce(
      (acc, item) => acc && item.check, true);
  }
  vide() {
    return this.getitems().length === 0;
  }
  /*  getTachesRestantes(): string {
    return this.todos.filter(todo => !todo.check).length;
          return 'Tâches restantes';
        }
        return 'Tâche restante';
        }  */
      SuppTodoCoche() {
        let AnnulerRetablir = false;
        for ( let i = 0; i < this.getitems().filter(item => item.check).length; i++ ) {
          if (i === this.getitems().filter(item => item.check).length - 1) {
            AnnulerRetablir = true;
          }
          this.supprimerTodo(this.getitems().filter(item => item.check)[i], AnnulerRetablir);
        }
       }
       supprimerTodo(item: TodoItemData, AnnulerRetablir: boolean) {
          this.todoService.supprimerTodos(AnnulerRetablir, item);
        }
        Annuler(): void {
          this.todoService.Actionannuler();
        }
        Retablir(): void {
          this.todoService.Actionretablir();
        }
        getitemfiltre(): TodoItemData[] {
          return this.getitems().filter(this.filtreCourant);
        }
     //     AumoinsunComplete(): boolean {
      //      return this.todos.filter(todo => todo.check).length > 0;
        //    }
        nbitemcoche(): number {
          return this.data.items.reduce(
            (acc, item) => acc + (item.check ? 1 : 0), 0 );
        }
        tachesRestantes(): number {
             return this.getitems().filter(todo => !todo.check).length;
               }
        affichagetache() {
          if (this.tachesRestantes() > 1 ) {
            return 'Tâches restantes';
          } else {
              return 'Tâche restante';
            }

        }
          // initial center position for the map

         clickedMarker(label: string, index: number) {
            console.log(`clicked the marker: ${label || index}`);
          }

          mapClicked($event: MouseEvent) {
            this.markers.push({
              lat: $event.coords.lat,
              lng: $event.coords.lng,
              draggable: true
            });
          }

          markerDragEnd(m: Marker, $event: MouseEvent) {
            console.log('dragEnd', m, $event);
          }

        // tslint:disable-next-line: no-unused-expression
        //'check la todo *val' : function(val){
        //this.items[parseInt(val)-1].check=true;
        //this.apply();
        //}
/*  public voiceSearch() {

  if ('webkitSpeechRecognition' in Window) {
    const vSearch = new webkitSpeechRecognition();
    vSearch.continuous = false;
    vSearch.interimresults = false;
    vSearch.lang = 'en-US';
    vSearch.start();
    const voiceSearchForm = this.formSearch.nativeElement;
    const voiceHandler = this.hiddenSearchHandler.nativeElement;
    vSearch.onresult = function(e) {
      voiceHandler.value = e.results[0][0].transcript;
      vSearch.stop();
      voiceSearchForm.submit();
    };
    vSearch.onresult = (e) => {
      this.formSearch = e.results[0][0].transcript;
      this.hiddenSearchHandler(this.formSearch);
      vSearch.stop();
    };

    vSearch.onerror = function(e) {
      console.log(e);
      vSearch.stop();
    };
  } else {
    console.log('Votre navigateur ne supporte pas la reconnaissance vocale');
  }
    }
    */
  }
