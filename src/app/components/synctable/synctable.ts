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
  { field: 'LoanID', headerText: 'Loan ID', width: 100 },
  { field: 'AccountNumber', headerText: 'Account No.', width: 150 },
  { field: 'CustomerName', headerText: 'Customer Name', width: 180 },
  { field: 'LoanType', headerText: 'Loan Type', width: 150 },
  { field: 'LoanAmount', headerText: 'Loan Amount ($)', width: 160 },
  { field: 'InterestRate', headerText: 'Interest Rate (%)', width: 150 },
  { field: 'Branch', headerText: 'Branch', width: 130 }
];

rowData: any[] = [
  { LoanID: 'LN001', AccountNumber: 'ACC789452', CustomerName: 'Ravi Sharma', LoanType: 'Home Loan', LoanAmount: 300000, InterestRate: 7.2, Branch: 'New York' },
  { LoanID: 'LN002', AccountNumber: 'ACC156984', CustomerName: 'Neha Verma', LoanType: 'Car Loan', LoanAmount: 28000, InterestRate: 8.5, Branch: 'San Francisco' },
  { LoanID: 'LN003', AccountNumber: 'ACC475823', CustomerName: 'Amit Patel', LoanType: 'Personal Loan', LoanAmount: 15000, InterestRate: 11.0, Branch: 'Chicago' },
  { LoanID: 'LN004', AccountNumber: 'ACC983215', CustomerName: 'Pooja Singh', LoanType: 'Education Loan', LoanAmount: 42000, InterestRate: 9.5, Branch: 'Boston' },
  { LoanID: 'LN005', AccountNumber: 'ACC264798', CustomerName: 'Vivek Rao', LoanType: 'Business Loan', LoanAmount: 100000, InterestRate: 10.5, Branch: 'Seattle' },
  { LoanID: 'LN006', AccountNumber: 'ACC546321', CustomerName: 'John Carter', LoanType: 'Home Loan', LoanAmount: 250000, InterestRate: 6.8, Branch: 'Houston' },
  { LoanID: 'LN007', AccountNumber: 'ACC875492', CustomerName: 'Sarah Lee', LoanType: 'Car Loan', LoanAmount: 32000, InterestRate: 9.2, Branch: 'Los Angeles' },
  { LoanID: 'LN008', AccountNumber: 'ACC192837', CustomerName: 'Michael Brown', LoanType: 'Education Loan', LoanAmount: 55000, InterestRate: 8.9, Branch: 'Denver' },
  { LoanID: 'LN009', AccountNumber: 'ACC654123', CustomerName: 'Priya Desai', LoanType: 'Personal Loan', LoanAmount: 20000, InterestRate: 10.0, Branch: 'Atlanta' },
  { LoanID: 'LN010', AccountNumber: 'ACC849372', CustomerName: 'David Kim', LoanType: 'Business Loan', LoanAmount: 180000, InterestRate: 9.8, Branch: 'Miami' }
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

