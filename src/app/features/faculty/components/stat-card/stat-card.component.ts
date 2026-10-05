import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {

  @Input() title = '';

  @Input() value: string | number = 0;

  @Input() subtitle = '';

  @Input() icon = '';

  @Input() color = 'blue';

  @Input() trend = '';

  @Input() trendType: 'up' | 'down' | 'neutral' = 'up';

}