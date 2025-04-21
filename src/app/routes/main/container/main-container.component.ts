import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventCategories, EVENTS, INITIAL_MAP_SIZE_PX, MIN_MAP_SIZE_PX, STRING_EMPTY, TOKEN_SIZE } from '@shared/constants';
import { MapToken } from '@shared/models';
import { StatusService, FileService, StorageService } from '@shared/services';
import { AnalyticsService } from '@shared/services/analitic.service';



const imports = [
  DragDropModule,
];

@Component({
  selector: 'app-main-container',
  imports,
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContainerComponent implements OnInit {
  @HostBinding('style.--token-size') nameOfVar = `${TOKEN_SIZE}px`;
  image: string = STRING_EMPTY;
  tokens: MapToken[] = [];
  mapFile!: File;
  imageElementWidth = 1600;
  tokenWidth = TOKEN_SIZE;
  isFirstToken = true;

  private readonly _destroyRef = inject(DestroyRef);

  constructor(
    private readonly statusService: StatusService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly storage: StorageService,
    private readonly fileService: FileService,
    private readonly analitycsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.statusService.BackGrounImageFile$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((image: File) => this.setFile(image));

    this.statusService.token$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((token) => this.handleToken(token));

    this.statusService.mapResizeCoeficient$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((value) => {
      const newWidth = INITIAL_MAP_SIZE_PX * value;
      this.imageElementWidth = newWidth >= MIN_MAP_SIZE_PX ? newWidth : MIN_MAP_SIZE_PX;
      this.changeDetectorRef.markForCheck();
    });

    this.setDefaultMap();
    this.analitycsService.trackEvent(EVENTS.LOAD_MAIN_PAGE.NAME, EVENTS.LOAD_MAIN_PAGE.DETAILS, EventCategories.MAIN);
  }

  setDefaultMap(): void {
    this.storage.getMap().then((map) => this.statusService.setBackGrounImageFile(map));
  }

  onDragEnd(event: CdkDragEnd, token: MapToken): void {
    token.position = { x: event.source.getFreeDragPosition().x, y: event.source.getFreeDragPosition().y };
    this.storage.setTokens(this.tokens);
  }

  popToken(event: Event, token: MapToken): void {
    event.stopPropagation();
    this.tokens = this.tokens.filter((t) => t !== token);
    this.storage.setTokens(this.tokens);
    this.changeDetectorRef.markForCheck();
  }

  private handleToken(token: MapToken): void {
    this.tokens.push(token);
    if (!this.isFirstToken) {
      this.storage.setTokens(this.tokens);
    } else {
      this.tokens = this.storage.getTokens();
      this.tokens.forEach((t) => {
        if (!t.b64File) { return;}
        const file = this.fileService.getFileFromB64(t.b64File);
        t.imageUrl = URL.createObjectURL(file);
      });
    }
    this.isFirstToken = false;
    this.changeDetectorRef.markForCheck();
  }

  private setFile(file: File): void {
    this.mapFile = file;
    this.image = URL.createObjectURL(file);
    this.changeDetectorRef.markForCheck();
  }
}
