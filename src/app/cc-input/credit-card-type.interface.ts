export interface CreditCardType {
  niceType: string;
  type: string;
  patterns: number[] | [number[]];
  gaps: number[];
  lengths: number[];
  code: {
    size: number;
    name: string;
  };
  matchStrength?: number;
}
