import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { HomeFeatures } from './components/home-features/home-features';
import { DemoCities } from './components/demo-cities/demo-cities';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { HomeCta } from './components/home-cta/home-cta';

@Component({
  selector: 'app-home',
  imports: [Hero, HomeFeatures, DemoCities, HowItWorks, HomeCta],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
