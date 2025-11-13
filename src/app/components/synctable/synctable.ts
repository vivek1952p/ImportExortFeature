import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-synctable',
  standalone: true,
  imports: [CommonModule, FormsModule, GridModule],
  templateUrl: './synctable.html',
  styleUrls: ['./synctable.css']
})
export class SyncTableComponent {

  columns: Array<{ field: string; headerText?: string; width?: number }> = [
    { field: 'Name', headerText: 'Name' },
    { field: 'Age', headerText: 'Age' },
    { field: 'City', headerText: 'City' }
  ];

  rowData: any[] = [
    { Name: 'Akash', Age:20 , City: 'Gurgaon' },
    { Name: 'Sahi', Age: 22, City: 'Roing' },
    {Name: 'Yash Yadav', Age: 21, City: 'Noida' },
    {Name: 'Shalu Yadav',Age: 20  ,City: 'Mysuru'},
    {Name: 'Alex', Age: 23, City: 'Kochi' }
  ];

  errors: string[] = [];
  successMessage = '';

  async onFileSelected(evt: Event) {
    this.clearMessages();
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.json')) {
      this.errors.push('Only .json files are accepted.');
      input.value = '';
      return;
    }

    await this.importFile(file);
    input.value = '';
  }

  private async importFile(file: File) {
    try {
      const text = await file.text();
      let parsed: any;

      try {
        parsed = JSON.parse(text);
      } catch (err) {
        this.errors.push('Invalid JSON format: ' + (err instanceof Error ? err.message : String(err)));
        return;
      }

      if (!Array.isArray(parsed)) {
        this.errors.push('JSON must be an array of objects.');
        return;
      }

      if (parsed.length === 0) {
        this.errors.push('JSON file is empty.');
        return;
      }

      if (!parsed.every(i => i && typeof i === 'object' && !Array.isArray(i))) {
        this.errors.push('Each array element must be an object.');
        return;
      }

      const uploadedKeys = new Set<string>();
      parsed.forEach(obj => Object.keys(obj).forEach(k => uploadedKeys.add(k)));

      this.columns = Array.from(uploadedKeys).map(k => ({ field: k, headerText: k }));

      this.rowData = parsed;
      this.successMessage = `Imported ${parsed.length} rows successfully.`;

    } catch (err) {
      this.errors.push('Import failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  exportJson() {
    this.clearMessages();
    try {
      const json = JSON.stringify(this.rowData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const filename = `table-${now.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      this.successMessage = `Exported ${this.rowData.length} rows successfully.`;
    } catch (err) {
      this.errors.push('Export failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  private clearMessages() {
    this.errors = [];
    this.successMessage = '';
  }
}

