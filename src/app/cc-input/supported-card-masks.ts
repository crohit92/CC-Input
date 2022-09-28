import { of } from 'rxjs';

export const supportedCardMasks$ = of({
  visa: '0000 - 0000 - 0000 - 0000',
  'american-express': '0000 - 000000 - 00000',
  mastercard: '0000 - 0000 - 0000 - 0000',
});
