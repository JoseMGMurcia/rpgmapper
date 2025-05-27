import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { S } from '@angular/cdk/keycodes';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EventCategories, EVENTS, INITIAL_MAP_SIZE_PX, MIN_MAP_SIZE_PX, STRING_EMPTY, TOKEN_SIZE } from '@shared/constants';
import { MapToken, TokenAtribute, TokenSizeEnum } from '@shared/models';
import { StatusService, FileService, StorageService } from '@shared/services';
import { AnalyticsService } from '@shared/services/analitic.service';


const imports = [
  DragDropModule,
  NgClass,
  FormsModule,
  TranslateModule,
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
  readonly tokenWidth = TOKEN_SIZE;
  isFirstToken = true;
  readonly TokenSizeEnum = TokenSizeEnum;

  private readonly _destroyRef = inject(DestroyRef);

  constructor(
    private readonly statusService: StatusService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly storage: StorageService,
    private readonly fileService: FileService,
    private readonly analitycsService: AnalyticsService){}

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

  rightClickOnToken(event: Event, token: MapToken): void {
    event.preventDefault();
    event.stopPropagation();
    this.tokens = this.tokens.map((t) => ({
      ...t,
      active: t.id === token.id ? !t.active : false,
    }));
  }

  leftClickOnToken(event: Event, token: MapToken): void {
    event.preventDefault();
    event.stopPropagation();
    this.tokens = this.tokens.map((t) => ({
      ...t,
      active: t.id === token.id ? t.active : false,
    }));
  }

  unselectAllTokens(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.tokens = this.tokens.map((t) => ({
      ...t,
      active: false,
    }));
  }

  clickOTokennMenu(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  popToken(event: Event, token: MapToken): void {
    event.stopPropagation();
    this.tokens = this.tokens.filter((t) => t !== token);
    this.storage.setTokens(this.tokens);
    this.changeDetectorRef.markForCheck();
  }

  addAtribute(token: MapToken): void {
    const newAttribute: TokenAtribute = {
      id: crypto.randomUUID(),
      label: STRING_EMPTY,
      value: 0,
    };
    token.attributes ??= [];
    token.attributes.push(newAttribute);
  }

  changeAtributeValue(attribute: TokenAtribute, value: number): void {
    attribute.value += value;
    this.storage.setTokens(this.tokens);
  }

  changeAtributeLabel(): void {
    this.storage.setTokens(this.tokens);
  }

  deleteAtributte(token: MapToken, attribute: TokenAtribute): void {
    token.attributes = token.attributes?.filter((attr) => attr.id !== attribute.id) || [];
    this.storage.setTokens(this.tokens);
    this.changeDetectorRef.markForCheck();
  }

  changeTokenSize(token: MapToken, increase = true): void {
    const newSize = increase ? token.size + 1 : token.size - 1;
    if (newSize > TokenSizeEnum.GARGANTUAN) { return; }
    if (newSize < TokenSizeEnum.SMALL) { return; }
    token.size = newSize;
    this.storage.setTokens(this.tokens);
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
