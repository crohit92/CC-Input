import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CCInputComponent } from './cc-input.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMaskModule.forChild(),
  ],
  declarations: [CCInputComponent],
  exports: [CCInputComponent],
})
export class CCInputModule {}
