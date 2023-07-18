import { Button } from "antd";
import React from "react";
import { CSVLink } from "react-csv";

interface exportCSVButtonProps {
  csvData: any[];
}

const ExportCSVButton: React.FC<exportCSVButtonProps> = ({ csvData }) => {
  return (
    <Button style={{ margin: "1%", backgroundColor: "lightgreen" }}>
      <CSVLink
        style={{ textDecoration: "none" }}
        filename={"Books.csv"}
        separator={";"}
        data={csvData}
      >
        Export to CSV
      </CSVLink>
    </Button>
  );
};

export default ExportCSVButton;
