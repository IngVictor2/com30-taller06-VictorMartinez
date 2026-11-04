import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { impactoRequerido, minimoItems, sinSoloEspacios } from './solicitud.validators';

describe('sinSoloEspacios', () => {
  it('rechaza una cadena formada solo por espacios', () => {
    expect(sinSoloEspacios(new FormControl('   '))).toEqual({ soloEspacios: true });
  });

  it('acepta texto con contenido', () => {
    expect(sinSoloEspacios(new FormControl('Ana Pérez'))).toBeNull();
  });

  it('acepta el primer valor válido de tres caracteres', () => {
    expect(sinSoloEspacios(new FormControl('Ana'))).toBeNull();
  });
});

describe('impactoRequerido', () => {
  const crearGrupo = (prioridad: string, impacto: string) =>
    new FormGroup({
      prioridad: new FormControl(prioridad),
      impacto: new FormControl(impacto),
    });

  it('falla con prioridad Crítica e impacto vacío', () => {
    expect(impactoRequerido(crearGrupo('Crítica', ''))).toEqual({ impactoRequerido: true });
  });

  it('pasa con prioridad Crítica e impacto escrito', () => {
    expect(impactoRequerido(crearGrupo('Crítica', 'Servicio caído'))).toBeNull();
  });

  it('pasa con una prioridad distinta de Crítica aunque el impacto esté vacío', () => {
    expect(impactoRequerido(crearGrupo('Alta', ''))).toBeNull();
  });
});

describe('minimoItems', () => {
  it('falla con cero filas', () => {
    const items = new FormArray<FormControl<string>>([]);
    items.setValidators(minimoItems(1));
    items.updateValueAndValidity();

    expect(items.hasError('minimoItems')).toBe(true);
  });

  it('pasa con una fila', () => {
    const items = new FormArray<FormControl<string>>([new FormControl('PC-1001', { nonNullable: true })]);
    items.setValidators(minimoItems(1));
    items.updateValueAndValidity();

    expect(items.hasError('minimoItems')).toBe(false);
  });
});
