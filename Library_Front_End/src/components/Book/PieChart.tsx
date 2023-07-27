import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { Pie, PieConfig } from "@ant-design/plots";
import { useBooks } from "./useBooks";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { BookContext } from "./BookContext";

interface pieChartProps {
  showCopies: boolean;
}

const PieChart: React.FC<pieChartProps> = ({ showCopies }) => {
  const {
    totalBooks,
    totalZeroQuantityBooks,
    totalBookCopies,
    totalBookCopiesReserved,
  } = useContext(BookContext);

  const totalAgainstAvailableBookData = [
    {
      type: "Books",
      value: totalBooks,
    },
    {
      type: "Available Books",
      value: totalBooks - totalZeroQuantityBooks,
    },
  ];

  const totalAgainstAvailableCopiesBookData = [
    {
      type: "Book Copies",
      value: totalBookCopies,
    },
    {
      type: "Available Book Copies",
      value: totalBookCopies - totalBookCopiesReserved,
    },
  ];

  const config: PieConfig = {
    appendPadding: 10,
    data: !showCopies
      ? totalAgainstAvailableBookData
      : totalAgainstAvailableCopiesBookData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: (data) => {
        return `${data.value}`;
      },
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      { type: "element-active" },
    ],
  };

  return <Pie {...config} />;
};

export default PieChart;
