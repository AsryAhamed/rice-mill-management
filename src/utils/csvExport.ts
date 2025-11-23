import { formatDate, formatCurrency, formatNumber } from "./helpers";
import type { Purchase, Production, Sale, Expense } from "@/lib/types";

// Convert Array → CSV
function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: string[]
): string {
  const rows = [headers];

  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header as keyof T];

      if (value === null || value === undefined) return "";

      if (typeof value === "string" && value.includes(",")) {
        return `"${value}"`;
      }

      return value as string;
    });

    rows.push(row);
  });

  return rows.map((row) => row.join(",")).join("\n");
}

// Download CSV
function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// EXPORT: Purchases
export function exportPurchasesToCSV(purchases: Purchase[]): void {
  const data = purchases.map((p) => ({
    Date: formatDate(p.date),
    Supplier: p.supplier,
    "Paddy Type": p.paddy_type,
    "Quantity (KG)": formatNumber(p.quantity_kg),
    "Total Amount": formatCurrency(p.total_amount),
  }));

  const csv = convertToCSV(data, Object.keys(data[0] || {}));
  downloadCSV(csv, `purchases_${new Date().toISOString().split("T")[0]}.csv`);
}

// EXPORT: Production
export function exportProductionToCSV(production: Production[]): void {
  const data = production.map((p) => ({
    Date: formatDate(p.date),
    "Paddy Type": p.paddy_type,
    "Input Paddy (KG)": formatNumber(p.input_paddy),
    "Rice Output (KG)": formatNumber(p.rice_output),
    "Yield %": p.yield_percentage ? formatNumber(p.yield_percentage) : "0",
  }));

  const csv = convertToCSV(data, Object.keys(data[0] || {}));
  downloadCSV(csv, `production_${new Date().toISOString().split("T")[0]}.csv`);
}

// EXPORT: Sales
export function exportSalesToCSV(sales: Sale[], type: string = "all"): void {
  const data = sales.map((s) => ({
    Date: formatDate(s.date),
    Customer: s.customer,
    Phone: s.phone || "",
    "Rice Type": s.rice_type,
    "Quantity (KG)": formatNumber(s.quantity),
    Amount: formatCurrency(s.amount),
    "Payment Type": s.payment_type,
    "Loan Status": s.loan_status || "",
    "Bank Name": s.bank_name || "",
    "Bank Account": s.bank_account || "",
  }));

  const csv = convertToCSV(data, Object.keys(data[0] || {}));
  downloadCSV(
    csv,
    `sales_${type}_${new Date().toISOString().split("T")[0]}.csv`
  );
}

// EXPORT: Expenses
export function exportExpensesToCSV(expenses: Expense[]): void {
  const data = expenses.map((e) => ({
    Date: formatDate(e.date),
    Category: e.category,
    Description: e.description || "",
    Amount: formatCurrency(e.amount),
  }));

  const csv = convertToCSV(data, Object.keys(data[0] || {}));
  downloadCSV(csv, `expenses_${new Date().toISOString().split("T")[0]}.csv`);
}
