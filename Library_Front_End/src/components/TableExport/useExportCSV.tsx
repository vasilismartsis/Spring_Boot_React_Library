import { useEffect, useState } from "react";

export interface ExportCSVState {
  csvData: any[];
}

export const useExportCSV: (tableData: any[]) => ExportCSVState = (
  tableData
) => {
  const [csvData, setCSVData] = useState<any[]>([]);

  useEffect(() => {
    const tableCSVData = [
      ["Exported by:", sessionStorage.getItem("username")],
      ["Exported date:", new Date()],
      [],
      tableData.length > 0 ? Object.keys(tableData[0]) : [],
      ...tableData.map((data) => Object.values(data)),
    ];

    setCSVData([...tableCSVData]);
  }, [tableData]);

  return { csvData };
};
