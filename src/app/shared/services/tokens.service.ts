import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}



}
