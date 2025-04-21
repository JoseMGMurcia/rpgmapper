import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DEFAULT_MODAL_OPTIONS } from '@shared/models';
import { ModalService } from '@shared/services/modal.service';
import { TermsComponent } from 'app/routes/legal/components/terms/terms.component';

const imports = [
  TranslateModule,
];

@Component({
  selector: 'app-footer',
  imports,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly modal: ModalService,
  ) { }

  handleTermsClicked() {
    this.modal.open(TermsComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      prevenCloseOutside: true,
    });
  }
}
