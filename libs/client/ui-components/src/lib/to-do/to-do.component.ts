import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircle as faCircleOutline,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faCircle,
  faCircleCheck,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { ITodo } from '@fst/shared/domain';

@Component({
  selector: 'fst-todo',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoComponent {
  @Input() todo: ITodo | undefined;

  completeIcon = faCircleCheck;
  incompleteIcon = faCircle;
  faCheck = faCheck;
  faCircleOutline = faCircleOutline;
  faPencil = faPencil;
  faTrashCan = faTrashCan;
}
