import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected menuOpen = signal(false);
  protected scrolled = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 16);
  }

  @HostListener('window:keydown.escape', [])
  onEscape(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
