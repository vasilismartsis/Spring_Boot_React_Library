import React from "react";
import { Button } from "antd";

interface ExportXLSXButtonProps {
  exportToXLSX: () => void;
}

const ExportXLSXButton: React.FC<ExportXLSXButtonProps> = ({
  exportToXLSX,
}) => {
  return (
    <Button type="primary" onClick={exportToXLSX}>
      Export to XLSX
    </Button>
  );
};

export default ExportXLSXButton;
