import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { COMMA, DEFAULT_MAP_SCALE, IMAGE_FILE_TYPES } from '@shared/constants';
import { TokenSizeEnum } from '@shared/models';
import { FileService, StatusService } from '@shared/services';
import { StorageService } from '@shared/services/storage.service';
import { validateImageFile } from '@shared/utils/file.utils';

const imports = [
  TranslateModule,
  MatSliderModule,
  ReactiveFormsModule,
];

@Component({
  selector: 'app-header',
  imports,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild("fileinput") fileinput!: ElementRef;
  acceptedFiles = Object.values(IMAGE_FILE_TYPES).join(COMMA);
  swChangingMap = false;
  form = this.getForm();

  constructor(
    private readonly statusService: StatusService,
    private readonly storage: StorageService,
    private readonly fileService: FileService,
  ){}

  ngAfterViewInit(): void {
    const mapScale = this.storage.getMapScale();
    this.storage.getMap().then((map) => this.statusService.setBackGrounImageFile(map));
    this.form.controls.size.valueChanges.subscribe((value) => this.mapResize(value));
    this.form.controls.size.setValue(mapScale);
  }

  handleAddToken() {
    this.swChangingMap = false;
    this.fileinput.nativeElement.click();
  }

  handleChangeMap() {
    this.acceptedFiles = Object.values(IMAGE_FILE_TYPES).join(COMMA);
    this.swChangingMap = true;
    this.fileinput.nativeElement.click();
  }

  onFileChange(event: Event) {
    if(this.swChangingMap) {
      this.changeMap(event);
      return;
    }
    this.addToken(event);
  }


  changeMap(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const file: File | undefined = element?.files?.[0];
    const valid = validateImageFile(file);

    if(!file || !valid) { return } //TODO show error message

    this.storage.setMap(file);
    this.statusService.setBackGrounImageFile(file);
  }

  mapResize(value: number | null) {
    if(!value) { return }
    this.statusService.setMapResizeCoeficient(value);
    this.storage.setMapScale(value);
  }

  addToken(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const file: File | undefined = element?.files?.[0];
    const valid = validateImageFile(file);

    if(!file || !valid) { return } //TODO show error message

    this.fileService.resizeImage(file, 100).then((f) =>
      this.fileService.getB64FromFile(f).then((b64) =>
        this.setToken(f, b64)));

  }

  getForm() {
    return new FormGroup({
      size: new FormControl(DEFAULT_MAP_SCALE),
    })
  }

  private setToken(file: File, b64: string): void {
    this.statusService.setToken({
      id: Date.now().toString(),
      imageUrl: URL.createObjectURL(file),
      label: file.name,
      size: TokenSizeEnum.MEDIUM,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      b64File: b64,
    });
  }

}
