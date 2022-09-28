import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CreditCardType } from './credit-card-type.interface';

export const supportedCardTypes$ = of([
  'visa',
  'american-express',
  'mastercard',
] as string[]); //.pipe(delay(3000));
