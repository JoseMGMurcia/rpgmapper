import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { DEFAULT_MAP_SCALE, STORAGE_KEYS } from '@shared/constants';
import { DEFAULT_TOKEN, MapToken } from '@shared/models';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private _localStorage: Storage = localStorage;
  private _sessionStorage: Storage = sessionStorage;

  constructor(
    private fileService: FileService
  ) {}

  public setMap(file: File,): void {
    this.fileService.getB64FromFile(file).then((b64) => this._localStorage.setItem(STORAGE_KEYS.MAP, b64));
  }

  public getMap(): Promise<File> {
    const map = localStorage.getItem(STORAGE_KEYS.MAP);
    if(map) {
      return new Promise((resolve) => resolve(this.fileService.getFileFromB64(map)));
    }
    return this.fileService.getDefaultFile();
  }

  public setTokens(tokens: MapToken[]): void {
    this._localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  }

  public getTokens(): MapToken[] {
    const tokens = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return tokens ? JSON.parse(tokens) : [DEFAULT_TOKEN];
  }

  public getMapScale(): number {
    return parseFloat(localStorage.getItem(STORAGE_KEYS.MAP_SCALE) || `${DEFAULT_MAP_SCALE}`);
  }

  public setMapScale(value: number): void {
    this._localStorage.setItem(STORAGE_KEYS.MAP_SCALE, value.toString());
  }
}
