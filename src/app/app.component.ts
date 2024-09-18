import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VeltService } from './services/velt.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { WireframeComponent } from './components/wireframe/wireframe.component';
import { CustomAnnotationDropdownData, CustomAnnotationDropdownItem } from '@veltdev/types';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, CommonModule, WireframeComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
	title = 'toolbar';

	isDarkMode: boolean = true;
	client: any;
	
	customList: CustomAnnotationDropdownItem[] = [
		{ id: '#bugs', label: '#bugs' },
		{ id: '#ideas', label: '#ideas' },
		{ id: '#qa', label: '#qa' },
	];

	customListDataOnCommentAnnotation: CustomAnnotationDropdownData = {
		type: 'single', // or 'multi' for multi selection
		placeholder: 'Select a Category',
		data: this.customList,
	};

	constructor(
		private veltService: VeltService,
		private authService: AuthService
	) { }

	/**
	 * Initializes the Velt service and set up the collaboration environment.
	 */
	async ngOnInit(): Promise<void> {

		// Initialize Velt with the API key
		await this.veltService.initializeVelt('AN5s6iaYIuLLXul0X4zf');

		// Identify the current user if authenticated
		const user = this.authService.userSignal();
		if (user) {
			await this.veltService.identifyUser(user);
		}

		// Contain your comments in a document by setting a Document ID & Name
		this.veltService.setDocument('toolbar', { documentName: 'toolbar' });

		// Enable dark mode for Velt UI
		this.veltService.setDarkMode(true);

		const commentElement = this.veltService.clientSignal()?.getCommentElement();
		commentElement?.createCustomListDataOnAnnotation(this.customListDataOnCommentAnnotation)


		commentElement?.onCommentSelectionChange().subscribe(e => {
			setTimeout(() => {
				(document.querySelectorAll(".velt-comment-dialog--selected app-comment-dialog-thread-card .velt-thread-card--time")).forEach(e => {
					console.log(e.innerHTML.split(' '))
					e.innerHTML = e.innerHTML.split(' ')[1] + e.innerHTML.split(' ')[2][0]
				})

			}, 300)
		})
	}

	// Change theme when user clicks on theme button
	toggleDarkMode() {
		this.isDarkMode = !this.isDarkMode;
		this.updateColorScheme();
	}

	// Update HTML & Velt Color theme 
	private updateColorScheme() {
		document.body.style.colorScheme = this.isDarkMode ? 'dark' : 'light';
		this.veltService.setDarkMode(this.isDarkMode);
	}
}
