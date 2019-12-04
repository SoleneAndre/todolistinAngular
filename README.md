# MIASHS-M2-TP3-Projet

Ce projet est une TodoList implémentée en Angular 8. :blush:

:heavy_exclamation_mark: Concernant la géolocalisation, il faudra certainement rentrer une clé API Google qui est la suivante : 

AIzaSyD3DfSPdWQKM2eqIN6PGpaR979Hz3NjSWs

## Liste des fonctionnalités développées :computer:

Diverses fonctionnalités sont présentes telles que : 
Undo/Redo, Effacer Tout , Reconnaissance vocale, Sérialisation / Déserialisation (LocalStorage), Geolocalisation.

Concernant la géolocalisation j'ai choisi de l'implémenter avec Google Map. 

Pour la Reconnaissance vocale, j'ai utilisé un module existant nommé ngx-speech-recognition. 

Veuillez trouver ci-dessous les liens des différentes API utilisées:

nom API | Lien
------------ | -------------
Google Maps API | [Ici](https://cloud.google.com/maps-platform/?hl=fr)
Ngx Speech Recognition  | [Ici](https://www.npmjs.com/package/@kamiazya/ngx-speech-recognition)

### Détails sur chaque fonctionnalité 

:earth_americas: 

__ 1. Map Google __ 
_ Avant de me lancer dans l’implémentation de la Google map , j'ai cherché comment je pourrais intégrer une map dans mon code. J'ai essayé plusieurs API google map avant de trouver la Google Map , notamment "angular-maps" , mais qui n'avait pas assez de méthodes et pas assez intuitif.
Après beaucoup de recherches, je me suis finalement orientée vers la google maps API. Je me suis donc créer un compte Clou Developpeur Google pour pouvoir utiliser leur API qui sont désormais accessible seulement via un compte.
J'ai donc crée un projet puis demander une clé API Google Map, et ensuite activer divers modules (Geolocation, Geocoding,..).

J'ai rencontré quelques difficultés pour implémenter au mieux cette map, notamment lorsque l'utilisateur entre une adresse, il fallait récupérer la latitude ainsi que la longitude, il a été difficile de trouver une fonction et ensuite de la positioner sur la map. De plus , il a été difficile de trouver comment utiliser cet API au sein d'une Todolist. Au départ , j'avais positionné une seule carte , mais finalement j'ai trouve ça mieux de laisser le choix à l'utilisateur pour chacun de ses items._

__ 2. Reconnaissance vocale __ 
_ ._

## QUICK START 

Clone the repo (or if you want download the Zip file):

git clone https://github.com/SoleneAndre/todolistinAngular.git

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Difficultés rencontrées 



