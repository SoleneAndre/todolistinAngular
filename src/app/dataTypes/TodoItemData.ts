import { NumberValueAccessor } from '@angular/forms';
import { Location, Marker } from '../dataTypes/map';

export class TodoItemData {
  label: string;
  check: boolean;
  location: Location = {
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
  map?;
  ville?: string;
}
