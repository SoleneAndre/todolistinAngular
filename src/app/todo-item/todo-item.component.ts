/// <reference types="@types/googlemaps" />
import { MouseEvent, AgmMap, MapsAPILoader} from '@agm/core';
import { Component, OnInit, Input, ViewChild, ElementRef, NgZone} from '@angular/core';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import {TodoListData} from '../dataTypes/TodoListData';
import { Marker } from '../dataTypes/map';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { Location } from '../dataTypes/map';

declare var google: any;

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  @Input()
  private data: TodoItemData;
  private edite = false;
  private geocoder: any;
  private adresse;
  private lienGoogle: string ;
  private infoWindow: string;
  private location =
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
  };
  private ajoutville = true;

  @ViewChild('inputData', {static: false}) newTextInput: ElementRef;
  @ViewChild('gSearch', {static: false}) formSearch;
  @ViewChild('searchKey', {static: false}) hiddenSearchHandler;
  @ViewChild('gMap', {static: false}) gmapElement: any;
  @ViewChild(AgmMap, {static: false}) map: AgmMap;


  constructor(private todoService: TodoService,
    public mapsApiLoader: MapsAPILoader,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper) {
  this.mapsApiLoader = mapsApiLoader;
  this.zone = zone;
  this.wrapper = wrapper;
  this.mapsApiLoader.load().then(() => {
  this.geocoder = new google.maps.Geocoder();
});
}

  ngOnInit() {
    this.location.marker.draggable = true;
  }

  getedite(): boolean {
    return this.edite;
  }

  markerDragEnd($event: MouseEvent, item: TodoItemData) {
    console.log($event);
    this.data.location.marker.lat = $event.coords.lat;
    this.data.location.marker.lng = $event.coords.lng;
    const latlng = {lat: $event.coords.lat, lng:  $event.coords.lng};
    this.geocoder.geocode({'location': latlng}, function(results, status) {


      if (status === 'OK') {
        if (results[0]) {
          // tslint:disable-next-line: no-shadowed-variable
          const res = results[0].formatted_address;
          const span = document.getElementById('villechange');
            span.innerHTML = '' + res;
       }
      }

});
console.log(this.adresse);

  }

  ajoutVille() {
    const val = confirm('Voulez-vous ajouter une localisation?');
    if (val === true) {
  this.adresse = prompt('Ville de la nouvelle TODO :)', '');
           // Si l'adresse n'est pas vide
   if (this.adresse !== '') {
 if (!this.geocoder) {
   this.geocoder = new google.maps.Geocoder();
  }
    this.geocoder.geocode({
      'address': this.adresse
    }, (results, status) => {
      console.log(results);
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0].geometry.location) {
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.infoWindow = this.getlabel();
          this.location.viewport = results[0].geometry.viewport;
        }
      } else {
        alert('Sorry, this search produced no results.');
      }
    });
    }
    this.data.location.marker.lat = this.location.lat;
    this.data.location.marker.lng = this.location.lng;
  this.ajoutville = false;
  // this.lienGoogle = 'https://www.google.com/maps/search/?api=1&query=' + this.adresse;
  this.todoService.setlocalStoragevillemap(this.adresse);
  this.lienGoogle = this.todoService.getlocalStoragevillemap();
  this.data.ville = this.adresse;
  console.log(this.lienGoogle);
    }
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

  getville(): string {
   return this.data.ville;
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
voirVille() {
  this.todoService.getlocalStoragevillemap();
}
ajoutVilletrue() {
  return true;
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
