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
  // déclaration de tout les attributs ou objets dont on aura besoin
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
// pour le data binding on recupere les elements enfants donc issus du html
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

  getedite(): boolean { // pour savoir si la todo est edite ou non
    return this.edite;
  }

  markerDragEnd($event: MouseEvent, item: TodoItemData) { // pour bouger le marker sur la map
    console.log($event); // on verifie le type d'evenement
    this.data.location.marker.lat = $event.coords.lat; // on enregistre dans l item location la latitude
    this.data.location.marker.lng = $event.coords.lng; // on enregistre dans l item location la longitude
    const latlng = {lat: $event.coords.lat, lng:  $event.coords.lng};
    this.geocoder.geocode({'location': latlng}, function(results, status) {

// fonction qui prend en paramètre les coordonnees lat et long d'une position et qui retourne une adresse de type string
      if (status === 'OK') {
        if (results[0]) {
          // tslint:disable-next-line: no-shadowed-variable
          const res = results[0].formatted_address;
          const span = document.getElementById('villechange'); // on affiche directement sur l'item correspondant, l'adresse
            span.innerHTML = '' + res;
       }
      }

});
console.log(this.adresse); // on verifie l'adresse

  }

  ajoutVille() { // ajouter une ville à l'item
    const val = confirm('Voulez-vous ajouter une localisation?');
    if (val === true) { // si l'utilisateur repond ok
  this.adresse = prompt('Ville de la nouvelle TODO :)', '');
           // Si l'adresse n'est pas vide
   if (this.adresse !== '') {
 if (!this.geocoder) {
   this.geocoder = new google.maps.Geocoder(); // on accede a la methode Geocoder de la maps
  }
    this.geocoder.geocode({ // il prend en parametre la string adresse que l'utilisateur a ajouté via le prompt
      'address': this.adresse
    }, (results, status) => {
      console.log(results);
      if (status === google.maps.GeocoderStatus.OK) { // fonction transformant l'adresse en latitude et longitude
        if (results[0].geometry.location) {
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat(); // ajout de la latitude du marker
          this.location.marker.lng = results[0].geometry.location.lng(); // ajout de la longitude du marker
          this.location.marker.draggable = true; // pour pouvoir bouger le marker sur la carte
          this.infoWindow = this.getlabel(); // afficher le nom de le todo en cliquant sur le marker
          this.location.viewport = results[0].geometry.viewport; // surface de la fenetre de la map
        }
      } else {
        alert('Sorry, this search produced no results.'); // si il y a erreur sur l'adresse par exemple
      }
    });
    }
    this.data.location.marker.lat = this.location.lat; // on met a jour notre marker
    this.data.location.marker.lng = this.location.lng; //
  this.ajoutville = false; // on a termine d ajouter la ville si on veut modifier il faudra bouger le marker
  this.todoService.setlocalStoragevillemap(this.adresse); // on met a jour le local Storage avec le nom de la ville
  this.lienGoogle = this.todoService.getlocalStoragevillemap(); // 
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
