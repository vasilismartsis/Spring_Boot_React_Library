import { useEffect, useState } from "react";

export interface ExportCSVState {
  csvData: any[];
}

export const useExportCSV: (tableData: any[]) => ExportCSVState = (
  tableData
) => {
  const [csvData, setCSVData] = useState<any[]>([]);

  const pieChartData = [
    { genre: "Fantasy", value: 25 },
    { genre: "Science Fiction", value: 18 },
    { genre: "Mystery", value: 12 },
    { genre: "Romance", value: 20 },
  ];

  useEffect(() => {
    const tableCSVData = [
      ["Exported by:", sessionStorage.getItem("username")],
      ["Exported date:", new Date()],
      [],
      tableData.length > 0 ? Object.keys(tableData[0]) : [],
      ...tableData.map((data) => Object.values(data)),
    ];

    const pieChartCSVData = [
      ["Pie Chart Data:"],
      ["Genre", "Value"],
      ...pieChartData.map((data) => [data.genre, data.value]),
    ];

    setCSVData([...tableCSVData, [], ...pieChartCSVData]);
  }, [tableData]);

  return { csvData };
};
