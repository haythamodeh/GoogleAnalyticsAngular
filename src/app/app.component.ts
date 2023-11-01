import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { ErrorAction, ErrorCategory, GoogleAnalyticsService } from './analytics/google-analytics-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-google-analytics';

  constructor(private readonly googleAnalyticsService: GoogleAnalyticsService){}

  ngOnInit() {
    if (!environment.production) {
      this.googleAnalyticsService.initialize();
    }
  }

  trackEvent() {
    // throw new Error('This is a simulated error for testing.');
    this.googleAnalyticsService.trackCustomEvent(
      ErrorCategory.General,
      ErrorAction.UnhandledException,
      {
        'error_message': 'Simulated error for testing3',
      },
      true
    );
    
    // this.googleAnalyticsService.event('button_click', 'User Interaction', 'Button Clicked', '1');
  }

}
