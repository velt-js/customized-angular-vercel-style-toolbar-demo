import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-wireframe',
	standalone: true,
	imports: [NgIf],
	templateUrl: './wireframe.component.html',
	styleUrl: './wireframe.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WireframeComponent {
}
