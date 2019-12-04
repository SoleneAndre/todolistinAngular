/// <reference types="@types/googlemaps" />
import { Component, NgZone, Input, OnInit, ViewChild} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import { TodoService } from '../todo.service';
import { AgmMap, MapsAPILoader} from '@agm/core';
import {  GoogleMapsAPIWrapper } from '@agm/core';
import {
  SpeechRecognitionLang,
  SpeechRecognitionMaxAlternatives,
  SpeechRecognitionService,
} from '@kamiazya/ngx-speech-recognition';

type FonctionFiltreItem = (item: TodoItemData) => boolean;
declare var google: any;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  providers: [
    {
      provide: SpeechRecognitionLang,
      useValue: 'fr-FR',
    },
    {
      provide: SpeechRecognitionMaxAlternatives,
      useValue: 1,
    },
    SpeechRecognitionService,
  ],
})


export class TodoListComponent implements OnInit {
  @ViewChild('gSearch', {static: false}) formSearch;
  @ViewChild('searchKey', {static: false}) hiddenSearchHandler;
  @ViewChild('gMap', {static: false}) gmapElement: any;
  @ViewChild(AgmMap, {static: false}) map: AgmMap;

  @Input()
  private data: TodoListData;
  private dataitem: TodoItemData;
  itemLabel: any;
  private infoWindow: string;
  private geocoder: any;
  private filtre: string;
  public message = '';

  constructor(private todoService: TodoService, public mapsApiLoader: MapsAPILoader,    private service: SpeechRecognitionService,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
    this.geocoder = new google.maps.Geocoder();
});
console.log('SubComponent', this.service);
// verifie si il y a bien la liaison entre le service et le component.
    this.service.onstart = (e) => {
      console.log('onstart');
}; // le service se met en route
this.service.onresult = (e) => {
  this.message = e.results[0].item(0).transcript;
  this.addTodo(this.message);
  console.log('SubComponent:onresult', this.message, e);
}; // le this.message est le message qu on a dit a haute voix. On l'ajoute a la todolist et on verifie via la console

    }
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
  this.todoService.addTodos({
    label: todoLabel, check: false, location :
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
    },
    map : new google.maps.Geocoder(),
  });
  }
  }

  gettodoLabel() {
    return this.dataitem.label;
  }
  tousCheck(): boolean {
    return this.getitems().reduce(
      (acc, item) => acc && item.check, true);
  }
  infoWindows() {
    return this.infoWindow;
  }
  vide() {
    return this.getitems().length === 0;
  }
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
        start() {
          this.service.start();
        }

        stop() {
          this.service.stop();
        }

  }
