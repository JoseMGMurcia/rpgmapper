import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogButton, DialogOptions } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})

// This component is used to easily display a dialog with a message and buttons
export class DialogComponent {
  @Input() options: DialogOptions = {}

  constructor( private modalService: ModalService) { }

  // Calls the action of the button and closes the dialog if the button is not set to prevent closing
  doAction(button: DialogButton) {
    button.action?.();
    button.preventClose || this.modalService.close();
  }
}
