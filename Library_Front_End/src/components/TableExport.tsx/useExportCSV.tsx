import { useEffect, useState } from "react";

export interface ExportCSVState {
  csvData: any[];
}

export const useExportCSV: (data: any[]) => ExportCSVState = (data) => {
  const [csvData, setCSVData] = useState<any[]>([]);

  useEffect(() => {
    setCSVData([
      ["Exported by:", sessionStorage.getItem("username")],
      ["Exported date:", new Date()],
      [],
      data.length > 0 ? Object.keys(data[0]) : [],
      ...data.map((data) => Object.values(data)),
    ]);
  }, [data]);

  return { csvData };
};
