
// import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
// export class ImportStorageService {
//   private imports: any[] = [];

//   addImport(record: any) {
//     this.imports.push(record);
//   }

//   getAllImports() {
//     return this.imports;
//   }

//   getImportById(id: number) {
//     return this.imports.find(x => x.id === id);
//   }
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportStorageService {

  private allImports: any[] = [];

  addImport(data: any) {
    this.allImports.push(data);
  }

  getAllImports() {
    return this.allImports;
  }

  getImportById(id: number) {
    return this.allImports.find(x => x.id === id);
  }
}
