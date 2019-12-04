export interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}
export interface Location {
    lat: number;
    lng: number;
    viewport?: Object;
    zoom: number;
    marker: Marker;
  }

