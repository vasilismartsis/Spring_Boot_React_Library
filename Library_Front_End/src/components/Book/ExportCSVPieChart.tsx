import React from "react";
import { Pie } from "react-chartjs-2";
import { saveAs } from "file-saver";
import { utils as XLSXUtils, writeFile as writeXLSXFile } from "xlsx";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

const ExportCSVPieChart = () => {
  // Dummy data for the pie chart
  const chartData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Dummy data for the Excel export
  const excelData = [
    ["Fruit", "Quantity"],
    ["Apple", 300],
    ["Banana", 50],
    ["Lemon", 100],
  ];

  const exportToExcel = () => {
    const worksheet = XLSXUtils.aoa_to_sheet(excelData);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeXLSXFile(workbook, "data.xlsx", { bookType: "xlsx", type: "array" })
      .then((excelBuffer: any) => {
        const data = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(data, "data.xlsx");
      })
      .catch((error: any) => {
        console.error("Error exporting Excel:", error);
      });
  };

  return (
    <div>
      <h2>Pie Chart</h2>
      <Pie data={chartData} />

      <button onClick={exportToExcel}>Export to Excel</button>
    </div>
  );
};

export default ExportCSVPieChart;
