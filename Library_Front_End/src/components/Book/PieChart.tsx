import React from "react";
import ReactDOM from "react-dom";
import { Pie, PieConfig } from "@ant-design/plots";
import { useBooks } from "./useBooks";

interface pieChartProps {
  showAvailable: boolean;
}

const PieChart: React.FC<pieChartProps> = ({ showAvailable }) => {
  const {
    totalBookNumber,
    books,
    bookError,
    setCurrentPage,
    currentPage,
    setGenres,
    bookRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doAddBook,
    doEditBook,
    doDeleteBook,
  } = useBooks(100);

  const bookData = books.map((book) => ({
    type: book.title,
    value: book.quantity,
  }));

  const config: PieConfig = {
    appendPadding: 10,
    data: bookData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: (data) => {
        return showAvailable
          ? `${(data.percent * 100).toFixed(0)}%`
          : `${(data.percent * 100).toFixed(0)}%`;
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
