import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  getDefaultFile(): Promise<File> {
    return this.http
      .get('assets/maps/Taberna.jpg', { responseType: 'blob' })
      .toPromise()
      .then((blob) => blob ? new File([blob], 'Taberna.jpg', { type: 'image/jpeg' }) : new File([], 'Taberna.jpg', { type: 'image/jpeg' }));
  }

  getB64FromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  getFileFromB64(b64: string): File {
    const b64Parts = b64.split(',');
    const contentType = b64Parts[0].split(':')[1].split(';')[0];
    const byteCharacters = atob(b64Parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], 'map.jpg', { type: contentType });
  }

  resizeImage(file: File, maxSidePx: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSidePx) {
              height *= maxSidePx / width;
              width = maxSidePx;
            }
          } else {
            if (height > maxSidePx) {
              width *= maxSidePx / height;
              height = maxSidePx;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx!.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob!], file.name, { type: file.type }));
          }, file.type);
        };
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
