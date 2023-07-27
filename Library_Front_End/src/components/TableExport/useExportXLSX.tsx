import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export interface ExportXLSXState {
  exportToXLSX: () => void;
  exportToExistingXLSX: () => void;
}

export const useExportXLSX = (tableData: any[]): ExportXLSXState => {
  const [xlsxData, setXLSXData] = useState<any[]>([]);

  useEffect(() => {
    setXLSXData(tableData);
  }, [tableData]);

  const exportToXLSX = () => {
    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(xlsxData);

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a downloadable file
    XLSX.writeFile(workbook, "exported_data.xlsx");
  };

  const exportToExistingXLSX = () => {
    console.log(tableData);
    // // Read the existing XLSX file
    // const existingWorkbook = XLSX.readFile("XLSXPieChartTemplate.xlsx");
    // // Get the first sheet in the workbook
    // const sheetName = existingWorkbook.SheetNames[0];
    // const existingWorksheet = existingWorkbook.Sheets[sheetName];
    // // Convert new data to a worksheet
    // const newWorksheet = XLSX.utils.json_to_sheet(xlsxData);
    // // Merge the new data with the existing sheet
    // const mergedWorksheet = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(mergedWorksheet, existingWorksheet, sheetName);
    // XLSX.utils.book_append_sheet(mergedWorksheet, newWorksheet, "NewSheet");
    // // Generate a downloadable file with the merged data
    // XLSX.writeFile(mergedWorksheet, "XLSXPieChartTemplate.xlsx");
  };

  return {
    exportToXLSX,
    exportToExistingXLSX,
  };
};
