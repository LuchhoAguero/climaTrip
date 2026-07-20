import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { HomeFeatures } from './components/home-features/home-features';
import { FeaturedCities } from './components/featured-cities/featured-cities';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { HomeCta } from './components/home-cta/home-cta';

@Component({
  selector: 'app-home',
  imports: [Hero, HomeFeatures, FeaturedCities, HowItWorks, HomeCta],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
