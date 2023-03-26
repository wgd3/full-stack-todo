import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'full-stack-todo-client-feature-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-feature-login.component.html',
  styleUrls: ['./client-feature-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFeatureLoginComponent {}
