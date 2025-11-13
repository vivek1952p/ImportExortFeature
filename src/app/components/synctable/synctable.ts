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
  // ✅ Fixed headers (5 columns)
  columns: Array<{ field: string; headerText?: string; width?: number }> = [
    { field: 'LoanID', headerText: 'Loan ID', width: 100 },
    { field: 'AccountNumber', headerText: 'Account No.', width: 150 },
    { field: 'CustomerName', headerText: 'Customer Name', width: 180 },
    { field: 'LoanAmount', headerText: 'Loan Amount ($)', width: 160 },
    { field: 'Branch', headerText: 'Branch', width: 130 }
  ];

  // ✅ Initial data
  rowData: any[] = [
    // { LoanID: 'LN001', AccountNumber: 'ACC789452', CustomerName: 'Ravi Sharma', LoanAmount: 300000, Branch: 'New York' },
    // { LoanID: 'LN002', AccountNumber: 'ACC156984', CustomerName: 'Neha Verma', LoanAmount: 28000, Branch: 'San Francisco' },
    // { LoanID: 'LN003', AccountNumber: 'ACC475823', CustomerName: 'Amit Patel', LoanAmount: 15000, Branch: 'Chicago' },
    // { LoanID: 'LN004', AccountNumber: 'ACC983215', CustomerName: 'Pooja Singh', LoanAmount: 42000, Branch: 'Boston' },
    // { LoanID: 'LN005', AccountNumber: 'ACC264798', CustomerName: 'Vivek Rao', LoanAmount: 100000, Branch: 'Seattle' },
    // { LoanID: 'LN006', AccountNumber: 'ACC546321', CustomerName: 'John Carter', LoanAmount: 250000, Branch: 'Houston' },
    // { LoanID: 'LN007', AccountNumber: 'ACC875492', CustomerName: 'Sarah Lee', LoanAmount: 32000, Branch: 'Los Angeles' },
    // { LoanID: 'LN008', AccountNumber: 'ACC192837', CustomerName: 'Michael Brown', LoanAmount: 55000, Branch: 'Denver' },
    // { LoanID: 'LN009', AccountNumber: 'ACC654123', CustomerName: 'Priya Desai', LoanAmount: 20000, Branch: 'Atlanta' },
    // { LoanID: 'LN010', AccountNumber: 'ACC849372', CustomerName: 'David Kim', LoanAmount: 180000, Branch: 'Miami' }
  ];

  errors: string[] = [];
  successMessage = '';

  // ✅ File select handler
  async onFileSelected(evt: Event) {
    this.clearMessages();
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.json')) {
      this.errors.push('Only .json files are accepted.');
      input.value = '';
      return;
    }

    await this.importFile(file);
    input.value = '';
  }

  // ✅ Import and merge JSON
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

      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.errors.push('JSON must be a non-empty array of objects.');
        return;
      }

      if (!parsed.every(i => i && typeof i === 'object' && !Array.isArray(i))) {
        this.errors.push('Each array element must be an object.');
        return;
      }

      // ✅ Normalize imported data to fixed columns
      const colKeys = this.columns.map(c => c.field);
      const normalizedData = parsed.map(obj => {
        const newObj: any = {};
        for (const key of colKeys) newObj[key] = obj[key] ?? '';
        return newObj;
      });

      // ✅ Deep clone and append (important for Grid refresh)
      this.rowData = [...this.rowData, ...normalizedData.map(o => ({ ...o }))];

      // ✅ Force rebind (if grid is not auto-refreshing)
      this.rowData = JSON.parse(JSON.stringify(this.rowData));

      this.successMessage = `Imported ${normalizedData.length} rows successfully. Total rows: ${this.rowData.length}.`;

    } catch (err) {
      this.errors.push('Import failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  // ✅ Export all rows
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
