import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ControlValueAccessor,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  Subject,
} from 'rxjs';

import creditCardType, { types as CardType } from 'credit-card-type';
import { CreditCardType } from './credit-card-type.interface';
import { supportedCardTypes$ } from './supported-card-types';
import { pluck } from 'rxjs/operators';
import { supportedCardMasks$ } from './supported-card-masks';
import { MaskApplierService } from 'ngx-mask';

@Component({
  selector: 'app-cc-input',
  templateUrl: './cc-input.component.html',
  styleUrls: ['./cc-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CCInputComponent,
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: CCInputComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CCInputComponent implements ControlValueAccessor, AsyncValidator {
  disabled$ = new BehaviorSubject<boolean>(false);
  value$ = new BehaviorSubject<string>('');

  expectedCardType$ = new BehaviorSubject<CreditCardType>(null);
  mask$ = combineLatest([this.expectedCardType$, supportedCardMasks$]).pipe(
    map(([card, maskMapping]) => {
      return (maskMapping[card?.type] as string) ?? '0000 - 0000 - 0000 - 0000';
    })
  );
  maskedValue$ = combineLatest([this.value$, this.mask$]).pipe(
    map(([value, mask]) => {
      const maskedValue = this.mask.applyMask(value, mask);
      // When user changes the mask characters (i.e. ' - ' etc. ) in the input control
      // the new computed masked value is same as before, so a rerendering does not happen, for that reason we are forcing a value update here
      (this.el.nativeElement.querySelector('input') as HTMLInputElement).value =
        maskedValue;
      return maskedValue;
    })
  );
  onChange = (value: string) => {};
  onTouched = () => {};
  constructor(
    private mask: MaskApplierService,
    private readonly el: ElementRef
  ) {}
  writeValue(value: string): void {
    this.value$.next(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled$.next(isDisabled);
  }

  handleValueChange($event: Event) {
    const rawValue =
      ($event.target as HTMLInputElement).value.match(/\d/g)?.join('') ?? '';
    this.onChange(rawValue);
    console.log(rawValue);
    this.value$.next(rawValue);
  }

  validate(
    control: AbstractControl<string, string>
  ): Observable<ValidationErrors> {
    return this.creditCardType(control.value).pipe(
      map((creditCardType) => {
        if (creditCardType) {
          const currentValue = control.value.match(/\d/g).join('');
          if (currentValue.length === creditCardType.lengths[0]) {
            return null;
          }
        }
        return {
          invalidCard: 'Invalid Credit card number',
        };
      })
    );
  }

  private creditCardType(cardNumber: string): Observable<CreditCardType> {
    if (!cardNumber || !creditCardType(cardNumber)) {
      return of(null);
    }
    const expectedCardType = creditCardType(cardNumber)[0];
    if (expectedCardType) {
      return supportedCardTypes$.pipe(
        map((supportedCardTypes) => {
          if (
            supportedCardTypes.find((type) => type === expectedCardType.type)
          ) {
            this.expectedCardType$.next(expectedCardType);
            return expectedCardType;
          }
          return null;
        })
      );
    }
    return of(null);
  }
}
