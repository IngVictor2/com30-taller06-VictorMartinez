import { ValidatorFn } from '@angular/forms';

export const M = 6;
export const TOPE = 24;
export const CODIGO = /^[A-Z]{2}[0-9]{3}$/;

export const multiplo: ValidatorFn = control =>
  control.value === '' || Number(control.value) % M === 0 ? null : { multiplo: true };

export const hastaMayor: ValidatorFn = grupo => {
  const desde = grupo.get('desde');
  const hasta = grupo.get('hasta');
  if (!desde?.valid || !hasta?.valid) return null;
  return Number(hasta.value) > Number(desde.value) ? null : { hastaMayor: true };
};
