import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router) {}

  title = 'Teya.gg';
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  getClass(route: string): string {
    const active = this.isActive(route);
    return `
          ${
            active
              ? 'group flex items-center space-x-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 dark:border-transparent dark:bg-gray-700 dark:text-white'
              : 'group flex items-center space-x-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600'
          }
          dark:text-gray-200`;
  }
}
