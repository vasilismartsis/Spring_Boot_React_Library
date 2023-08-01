import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";
import PieChart from "../Book/PieChart";

export interface ExportPDFState {
  exportToPDF: () => void;
}

export const useExportPDF: (data: any[]) => ExportPDFState = (data) => {
  const [pdfData, setPDFData] = useState<any[]>([]);

  useEffect(() => {
    setPDFData(data);
  }, [data]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableRows = pdfData.map((rowData) =>
      Object.values(rowData).map((value) => String(value))
    );
    const tableColumns = pdfData.length > 0 ? Object.keys(pdfData[0]) : [];
    const content = [
      ["Exported by: ", sessionStorage.getItem("username")],
      ["Exported date: ", new Date()],
      ["&nbsp;"],
      tableColumns,
      ...tableRows,
    ];

    const tableElement = document.createElement("table");
    tableElement.innerHTML = content
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
      )
      .join("");

    document.body.appendChild(tableElement); // Append table to document

    html2canvas(tableElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10, 190, 0);

      doc.save("data.pdf");

      document.body.removeChild(tableElement); // Remove table from document after PDF generation
    });
  };

  return { exportToPDF };
};
