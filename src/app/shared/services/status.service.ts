import { Injectable } from '@angular/core';
import { DEFAULT_TOKEN, MapToken } from '@shared/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StatusService {
  public get token$(): BehaviorSubject<MapToken> { return this._token; }
  public get BackGrounImageFile$(): BehaviorSubject<File> { return this._BackGrounImageFile; }
  public get mapResizeCoeficient$(): BehaviorSubject<number> { return this._mapResizeCoeficient; }

  private readonly _token: BehaviorSubject<MapToken> = new BehaviorSubject(DEFAULT_TOKEN);
  private readonly _BackGrounImageFile: BehaviorSubject<File> = new BehaviorSubject(new File([], 'assets/maps/Taberna.jpg'));
  private readonly _mapResizeCoeficient: BehaviorSubject<number> = new BehaviorSubject(1);

  public setToken(value: MapToken): void {
    this._token.next(value);
  }

  public setBackGrounImageFile(value: File): void {
    this._BackGrounImageFile.next(value);
  }

  public setMapResizeCoeficient(value: number): void {
    this._mapResizeCoeficient.next(value);
  }
}
