import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NUMBERS, STRING_EMPTY } from '@shared/constants';
import { MapToken } from '@shared/models';
import { StatusService, FileService, StorageService, LoadingService } from '@shared/services';

const INITIAL_MAP_SIZE_PX = NUMBERS.N_1300;
const TOKEN_SIZE = NUMBERS.N_35;

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

  private readonly _destroyRef = inject(DestroyRef);

  constructor(
    private readonly statusService: StatusService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly storage: StorageService,
    private readonly fileService: FileService,
  ) {}

  ngOnInit(): void {
    this.statusService.BackGrounImageFile$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((image: File) => this.setFile(image));

    let isFirstToken = true;
    this.statusService.token$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((token) => {
      this.tokens.push(token);
      if (!isFirstToken) {
        this.storage.setTokens(this.tokens);
      } else {
        this.tokens = this.storage.getTokens();
        this.tokens.forEach((t) => {
          if (!t.b64File) { return;}
          const file = this.fileService.getFileFromB64(t.b64File);
          t.imageUrl = URL.createObjectURL(file);
        });
      }
      isFirstToken = false;
      this.changeDetectorRef.markForCheck();
    });

    this.statusService.mapResizeCoeficient$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((value) => {
      this.imageElementWidth = INITIAL_MAP_SIZE_PX * value;
      this.changeDetectorRef.markForCheck();
    });

    this.setDefaultMap();
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

  private setFile(file: File): void {
    this.mapFile = file;
    this.image = URL.createObjectURL(file);
    this.changeDetectorRef.markForCheck();
  }
}
