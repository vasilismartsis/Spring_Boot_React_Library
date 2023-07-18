import { Button } from "antd";
import React from "react";

interface exportPDFButtonProps {
  exportToPDF: () => void;
}

const ExportPDFButton: React.FC<exportPDFButtonProps> = ({ exportToPDF }) => {
  return (
    <Button onClick={exportToPDF} type="primary" danger>
      Export to PDF
    </Button>
  );
};

export default ExportPDFButton;
