import { Component, computed, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CODIGO, M, TOPE } from './validadores';

@Component({
  selector: 'app-parcial-detalle',
  imports: [RouterLink],
  template: `
    <section class="tarjeta">
      <header class="tarjeta-cabecera"><h2>Detalle de la solicitud</h2></header>
      @if (!codigoValido()) {
        <p>Código inválido</p>
      } @else if (!cantidadValida()) {
        <p>Cantidad inválida</p>
      } @else {
        <p>Código: {{ codigo() }}</p>
        <p>Cantidad: {{ cantidad() }}</p>
        <p>Bloques: {{ bloques() }}</p>
        <p>Margen: {{ margen() }}</p>
      }
      <a routerLink="/parcial2">Volver al formulario</a>
    </section>
  `,
})
export class DetalleParcial {
  readonly codigo = input.required<string>();
  readonly cantidad = input(0, { transform: numberAttribute });
  readonly codigoValido = computed(() => CODIGO.test(this.codigo()));
  readonly cantidadValida = computed(() =>
    this.cantidad() >= 1 && this.cantidad() <= TOPE && this.cantidad() % M === 0
  );
  readonly bloques = computed(() => this.cantidad() / M);
  readonly margen = computed(() => TOPE - this.cantidad());
}
