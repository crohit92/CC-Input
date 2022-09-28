import { Component, VERSION } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  group = new FormGroup({
    input: new FormControl('', [Validators.required]),
  });
  constructor() {
    // this.group.get('input').disable();
  }
}
