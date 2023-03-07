import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fst-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoComponent {}
