import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@fst/client/data-access';

@Component({
  selector: 'full-stack-todo-feature-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-dashboard.component.html',
  styleUrls: ['./feature-dashboard.component.scss'],
})
export class FeatureDashboardComponent {
  private readonly apiService = inject(ApiService);

  todoItems$ = this.apiService.getAllToDoItems();
}
