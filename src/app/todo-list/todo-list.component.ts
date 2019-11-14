/// <reference types="@types/googlemaps" />
import {ChangeDetectionStrategy, Component, NgZone, Input, OnInit, ViewChild, ElementRef,ChangeDetectorRef} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import { TodoService } from '../todo.service';
import { MouseEvent, AgmMap, MapsAPILoader} from '@agm/core';
import { Marker } from '../dataTypes/map';
import { Location } from '../dataTypes/map';
import { templateJitUrl } from '@angular/compiler';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

type FonctionFiltreItem = (item: TodoItemData) => boolean;
declare var webkitSpeechRecognition: any;
declare var google: any;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})


export class TodoListComponent implements OnInit {
  @ViewChild('gSearch', {static: false}) formSearch;
  @ViewChild('searchKey', {static: false}) hiddenSearchHandler;
  @ViewChild('gMap', {static: false}) gmapElement: any;
  @ViewChild(AgmMap, {static: false}) map: AgmMap;

  @Input()
  private data: TodoListData;
  private filtre: string;
  private edite = false;
  private dataitem: TodoItemData;
  private suppcacheEdite: string;
  itemLabel: any;
  private newmarkers;
  private geocoder: any;
  public location: Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 5
  };

  constructor(private todoService: TodoService, public mapsApiLoader: MapsAPILoader,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper) {
this.mapsApiLoader = mapsApiLoader;
this.zone = zone;
this.wrapper = wrapper;
this.mapsApiLoader.load().then(() => {
this.geocoder = new google.maps.Geocoder();
});
}

  filterCheck: FonctionFiltreItem = item => item.check;
  filterUnCheck: FonctionFiltreItem = item => !item.check;
  filterAll: FonctionFiltreItem = () => true;
  // tslint:disable-next-line: member-ordering
  filtreCourant: FonctionFiltreItem = this.filterAll;

  ngOnInit() {
    this.filtre = 'toutes';
    this.location.marker.draggable = true;
  }

  getlabel(): string {
    return this.data ? this.data.label : '';
  }

  getitems(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }
  findLocation(address) {
    if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(results);
      if (status === google.maps.GeocoderStatus.OK) {
        for (let i = 0; i < results[0].address_components.length; i++) {
          const types = results[0].address_components[i].types;

          if (types.indexOf('locality') !== -1) {
            this.location.address_level_2 = results[0].address_components[i].long_name;
          }
          if (types.indexOf('country') !== -1) {
            this.location.address_country = results[0].address_components[i].long_name;
          }
          if (types.indexOf('postal_code') !== -1) {
            this.location.address_zip = results[0].address_components[i].long_name;
          }
          if (types.indexOf('administrative_area_level_1') !== -1) {
            this.location.address_state = results[0].address_components[i].long_name;
          }
        }

        if (results[0].geometry.location) {
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }
        this.map.triggerResize();
      } else {
        alert('Sorry, this search produced no results.');
      }
    });
  }
  updateOnMap() {
    let full_address: string = this.location.address_level_1 || '';
    if (this.location.address_level_2) { full_address = full_address + ' ' + this.location.address_level_2; }
    if (this.location.address_state) { full_address = full_address + ' ' + this.location.address_state; }
    if (this.location.address_country) { full_address = full_address + ' ' + this.location.address_country; }

    this.findLocation(full_address);
  }

  addTodo(todoLabel: string) {
    if (todoLabel) {
      const val = confirm('Voulez-vous ajouter une localisation?');
      if (val === true) {
        const adress = prompt('Quel ville souhaitez-vous ajouter?', '');
        this.findLocation(adress); }
    this.todoService.addTodos({
      label: todoLabel, check: false
    });
  }
}

  tousCheck(): boolean {
    return this.getitems().reduce(
      (acc, item) => acc && item.check, true);
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

 public voiceSearch() {

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
  }
