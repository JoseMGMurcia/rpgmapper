import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-terms',
  imports: [TranslateModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {

  constructor(
    private readonly modalService: ModalService
  ) { }

  onClose() {
    this.modalService.close();
  }
}
