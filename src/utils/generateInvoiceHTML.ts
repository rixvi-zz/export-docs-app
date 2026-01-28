export function generateHTML(docData: any, documentType: string): string {
  const title =
    documentType === 'proforma-invoice'
      ? 'PROFORMA INVOICE'
      : 'COMMERCIAL INVOICE';

  const currency = docData.currency || 'USD';

  const total =
    docData.goods?.reduce(
      (sum: number, g: any) => sum + (g.totalPrice || 0),
      0
    ) || 0;

  const rows =
    docData.goods?.length > 0
      ? docData.goods
          .map(
            (item: any) => `
<tr>
  <td class="border px-2 py-2 text-xs">${item.description || '-'}</td>
  <td class="border px-2 py-2 text-xs">${item.category || '-'}</td>
  <td class="border px-2 py-2 text-xs">${item.hsCode || '-'}</td>
  <td class="border px-2 py-2 text-xs text-right">${item.quantity || 0}</td>
  <td class="border px-2 py-2 text-xs">${item.unit || '-'}</td>
  <td class="border px-2 py-2 text-xs text-right">${currency} ${(item.unitPrice || 0).toFixed(2)}</td>
  <td class="border px-2 py-2 text-xs text-right">${currency} ${(item.totalPrice || 0).toFixed(2)}</td>
</tr>`
          )
          .join('')
      : `<tr><td colspan="7" class="border text-center py-4 text-xs">No goods</td></tr>`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<script src="https://cdn.tailwindcss.com"></script>

<style>
@page { size: A4; margin: 15mm; }
body { font-family: Inter, system-ui, sans-serif; background: white; }
</style>
</head>

<body>
<div class="w-[794px] mx-auto bg-white">

  <div class="border-b-2 pb-4 mb-6 flex justify-between">
    <h1 class="text-2xl font-bold">${title}</h1>
    <div class="text-sm text-right">
      <div>Date: ${new Date().toLocaleDateString()}</div>
      <div>Currency: ${currency}</div>
    </div>
  </div>

  <table class="w-full border-collapse border mb-8">
    <thead class="bg-gray-100">
      <tr>
        <th class="border px-2 py-2 text-xs">Description</th>
        <th class="border px-2 py-2 text-xs">Category</th>
        <th class="border px-2 py-2 text-xs">HS</th>
        <th class="border px-2 py-2 text-xs">Qty</th>
        <th class="border px-2 py-2 text-xs">Unit</th>
        <th class="border px-2 py-2 text-xs">Rate</th>
        <th class="border px-2 py-2 text-xs">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="flex justify-end">
    <div class="border bg-gray-100 px-4 py-2 font-semibold">
      TOTAL: ${currency} ${total.toFixed(2)}
    </div>
  </div>

</div>
</body>
</html>
`;
}