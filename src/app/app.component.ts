import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoadingService } from '@shared/services';
import { firstValueFrom } from 'rxjs';

const imports = [
  CommonModule,
  RouterOutlet,
  HeaderComponent,
  FooterComponent,
];

@Component({
  selector: 'app-root',
  imports,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{


  loading = true;
  translationsLoaded = false;
  private readonly _destroyRef = inject(DestroyRef);

  constructor(
    private readonly loadingService: LoadingService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly translate: TranslateService,
  ) {}

  async ngOnInit() {
    this.fetch();
  }

  private setLoagingStatus(): void {
    this.loadingService.loading$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((loading: boolean) => {
      this.loading = loading;
      this.changeDetectorRef.markForCheck();
    });
  }

  private async fetch() {
    await firstValueFrom(this.translate.get('_'));
    this.translationsLoaded = true;
    this.setLoagingStatus();
    this.loadingService.hide();

    this.setInnerHeight();
    window.addEventListener('resize', () => this.setInnerHeight());
  }

  private setInnerHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const modal = document.querySelector('.modal') as HTMLElement;
    if (modal) {
      modal.style.setProperty('--vh', `${vh}px`);
    }
  }
}
