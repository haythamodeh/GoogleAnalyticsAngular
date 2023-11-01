import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterState } from '@angular/router';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';


declare var gtag: Function;

@Injectable({
  providedIn: 'root',
})


export class GoogleAnalyticsService {
  constructor(private router: Router, private titleService: Title,
    @Inject(DOCUMENT) private document: Document) {}

  public initialize() {
    this.onRouteChange();

    // dynamically add analytics scripts to document head
    try {
      const url = 'https://www.googletagmanager.com/gtag/js?id=';
      const gTagScript = document.createElement('script');      
      gTagScript.async = true;
      gTagScript.src = `${url}${environment.googleAnalyticsId}`;
      document.head.appendChild(gTagScript);

      const dataLayerScript = document.createElement('script');
      dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${environment.googleAnalyticsId}');`;
      document.head.appendChild(dataLayerScript);
    } catch (e) {
      console.error('Error adding Google Analytics', e);
    }
  }

  // track visited routes
  // private onRouteChange() {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       gtag('config', environment.googleAnalyticsId, {
  //         'page_path': event.urlAfterRedirects,
  //         // 'page_title': this.getPageTitle() // Use a function to get the page title
  //       });
  //       console.log('Sending Google Analytics tracking for: ', event.urlAfterRedirects);
  //       console.log('Google Analytics property ID: ', environment.googleAnalyticsId);
  //     }
  //   });
  // }

  // track visited routes
  private onRouteChange() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(this.router.routerState, this.router.routerState.root).join('-');
        this.titleService.setTitle(title);
        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href
        })
      }
    });
  }

  // Helper function to get the page title
  getTitle(state: RouterState, parent: ActivatedRoute): string[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data['title']) {
      data.push(parent.snapshot.data['title']);
    }
    if (state && parent && parent.firstChild) {
      data.push(...this.getTitle(state, parent.firstChild));
    }
    return data;
  }

  // use gtag.js to send Google Analytics Events
  public event(action: string, eventCategory?: string, eventLabel?: string, value?: string) {
    gtag('event', action, {
      ...(eventCategory && { event_category: eventCategory }),
      ...(eventLabel && { event_label: eventLabel }),
      ...(value && { value: value }),
    });
  }

  // Generic function to track custom events
  public trackCustomEvent(
    eventCategory: EventCategory | ErrorCategory, // Allow tracking both event and error
    eventAction: EventAction | ErrorAction, // Allow tracking both event and error
    eventData?: Record<string, any>,
    isError: boolean = false // Specify if it's an error event
  ) {
    const eventCategoryKey = isError ? 'error_category' : 'event_category';
    const eventActionKey = isError ? 'error_action' : 'event_action';
  
    const trackingData = {
      [eventCategoryKey]: eventCategory,
      [eventActionKey]: eventAction,
      ...eventData, // Additional event data can be passed as an object
    };
  
    gtag('event', eventCategory, trackingData);
  }
  
  ////////////// ////////////// 
  //example usage
  // Track a custom button click event
  // this.gaService.trackCustomEvent(EventCategory.ButtonClicks, EventAction.SubmitButton, {
  //   'page_path': event.urlAfterRedirects,
  // });
  // Track an error event
  // this.gaService.trackCustomEvent(ErrorCategory.General, ErrorAction.UnhandledException, {
  //   'error_message': 'An unhandled exception occurred.',
  // }, true);
  ////////////// ////////////// 

  ////////////// TRACKING PAGE VIEW ////////////

  // // Track a custom page view event
  // gtag('event', 'page_view', {
  //   'page_path': event.urlAfterRedirects,  // Specify the current page path
  //   'page_title': 'Your Page Title Here',  // Optionally include the page title
  //   // You can add other custom parameters as needed for additional context
  //   'custom_parameter': 'custom_value',
  //   'another_parameter': 'another_value',
  // });

  ////////// EVENTS /////////////

  // // Track a custom button click event
  // gtag('event', 'button_click', {
  //   'button_id': 'submit_button',  // Identify the button or interaction
  //   'page_path': event.urlAfterRedirects,  // Include the current page path
  // });

  // // Track a custom form submission event
  // gtag('event', 'form_submission', {
  //   'form_id': 'contact_form',  // Identify the form
  //   'page_path': event.urlAfterRedirects,  // Include the current page path
  // });

  // // Track a custom video play event
  // gtag('event', 'video_play', {
  //   'video_id': 'promo_video',  // Identify the video
  //   'page_path': event.urlAfterRedirects,  // Include the current page path
  // });

  // // Track a custom download event
  // gtag('event', 'download', {
  //   'file_name': 'example.pdf',  // Identify the downloaded file
  //   'page_path': event.urlAfterRedirects,  // Include the current page path
  // });

  // // Track a custom product view event (for e-commerce sites)
  // gtag('event', 'product_view', {
  //   'product_id': '12345',  // Identify the viewed product
  //   'page_path': event.urlAfterRedirects,  // Include the current page path
  // });

  // // Track a custom external link click event
  // gtag('event', 'external_link_click', {
  //   'link_url': 'https://example.com',  // Identify the external link URL
  //   'page_path': event.urlAfterRedirects,  // Include the current page path
  // });

  // In your error-handling code, when an error occurs:
  // gtag('event', 'error', {
  //   'error_message': 'Description of the error',
  //   'page_path': event.urlAfterRedirects, // Include the page where the error occurred
  // });


}

// event-categories.enum.ts
export enum EventCategory {
  PageViews = 'page_views',
  ButtonClicks = 'button_clicks',
  FormSubmissions = 'form_submissions',
  VideoPlays = 'video_plays',
  Downloads = 'downloads',
  ProductViews = 'product_views',
  ExternalLinkClicks = 'external_link_clicks',
  // Add more event categories as needed
}


// event-actions.enum.ts
export enum EventAction {
  SubmitButton = 'submit_button',
  ContactForm = 'contact_form',
  PromoVideo = 'promo_video',
  ExampleDownload = 'example_download',
  ViewedProduct = 'viewed_product',
  OpenedExternalLink = 'opened_external_link',
  // Add more event actions as needed
}


// error-enums.ts
export enum ErrorCategory {
  General = 'error_general',
  PageNotFound = 'error_page_not_found',
  Validation = 'error_validation',
  // Add more error categories as needed
}

export enum ErrorAction {
  UnhandledException = 'error_unhandled_exception',
  UserError = 'error_user_error',
  // Add more error actions as needed
}
