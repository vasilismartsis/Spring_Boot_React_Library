package com.library.Library_Back_End.book.BookExport;

import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.BookExport.BookExport;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.reservation.ReservationRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xddf.usermodel.chart.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Component
public class XLSXBookExport extends BookExport {
    public XLSXBookExport(AuditingConfig auditingConfig, BookRepository bookRepository, ReservationRepository reservationRepository) {
        super(auditingConfig, bookRepository, reservationRepository);
    }

    public byte[] generateFile() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet bookSheet = createExcelBookSheet(workbook);
            XSSFSheet chartSheet = createExcelChartSheet(workbook);

            createExcelBookTable(bookSheet);
            createExcelTotalsTable(chartSheet);

            createExcelTotalBooksPieChart(chartSheet);
            createExcelTotalBookCopiesPieChart(chartSheet);

            // Write to the output stream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private XSSFSheet createExcelBookSheet(XSSFWorkbook workbook) {
        XSSFSheet bookSheet = workbook.createSheet("Books");

        Row exportedByRow = bookSheet.createRow(0);
        exportedByRow.createCell(0).setCellValue("Exported by:");
        exportedByRow.createCell(1).setCellValue(auditingConfig.getAuditor().getUsername());

        Row exportedDateRow = bookSheet.createRow(1);
        exportedDateRow.createCell(0).setCellValue("Exported date:");
        exportedDateRow.createCell(1).setCellValue(new Date().toString());

        return bookSheet;
    }

    private XSSFSheet createExcelChartSheet(XSSFWorkbook workbook) {
        XSSFSheet bookSheet = workbook.createSheet("Charts");

        Row exportedByRow = bookSheet.createRow(0);
        exportedByRow.createCell(0).setCellValue("Exported by:");
        exportedByRow.createCell(1).setCellValue(auditingConfig.getAuditor().getUsername());

        Row exportedDateRow = bookSheet.createRow(1);
        exportedDateRow.createCell(0).setCellValue("Exported date:");
        exportedDateRow.createCell(1).setCellValue(new Date().toString());

        return bookSheet;
    }

    private void createExcelBookTable(XSSFSheet sheet) {
        List<Book> books = bookRepository.findAll();

        Row headerRow = sheet.createRow(3);

        // Create header cells
        headerRow.createCell(0).setCellValue("Id");
        headerRow.createCell(1).setCellValue("Title");
        headerRow.createCell(2).setCellValue("Quantity");
        headerRow.createCell(3).setCellValue("Genre");
        headerRow.createCell(4).setCellValue("createdBy");
        headerRow.createCell(5).setCellValue("lastModifiedBy");
        headerRow.createCell(6).setCellValue("creationDate");
        headerRow.createCell(7).setCellValue("lastModifiedDate");

        // Populate the rows with book data
        int rowIndex = 4;
        for (Book book : books) {
            Row row = sheet.createRow(rowIndex);
            row.createCell(0).setCellValue(book.getId());
            row.createCell(1).setCellValue(book.getTitle());
            row.createCell(2).setCellValue(book.getQuantity());
            row.createCell(3).setCellValue(book.getGenre().toString());
            row.createCell(4).setCellValue(book.getCreatedBy().getUsername());
            row.createCell(5).setCellValue(book.getLastModifiedBy().getUsername());
            row.createCell(6).setCellValue(book.getCreationDate().toString());
            row.createCell(7).setCellValue(book.getLastModifiedDate().toString());
            rowIndex++;
        }
    }

    private void createExcelTotalsTable(XSSFSheet sheet) {
        long totalBooks = bookRepository.count();
        long totalZeroQuantityBooks = bookRepository.countByQuantity(0);
        int totalBookCopiesNotReserved = bookRepository.sumQuantity();
        long totalBookCopiesReserved = reservationRepository.count();
        long totalBookCopies = totalBookCopiesNotReserved + totalBookCopiesReserved;

        int totalsColumnIndex = 0;
        int quantitiesColumnIndex = 1;
        sheet.createRow(3).createCell(totalsColumnIndex).setCellValue("Totals");
        sheet.getRow(3).createCell(quantitiesColumnIndex).setCellValue("Quantities");

        sheet.createRow(4).createCell(totalsColumnIndex).setCellValue("Books");
        sheet.createRow(5).createCell(totalsColumnIndex).setCellValue("Available Books");
        sheet.createRow(6).createCell(totalsColumnIndex).setCellValue("Book Copies");
        sheet.createRow(7).createCell(totalsColumnIndex).setCellValue("Available Book Copies");

        sheet.getRow(4).createCell(quantitiesColumnIndex).setCellValue(totalBooks);
        sheet.getRow(5).createCell(quantitiesColumnIndex).setCellValue(totalBooks - totalZeroQuantityBooks);
        sheet.getRow(6).createCell(quantitiesColumnIndex).setCellValue(totalBookCopies);
        sheet.getRow(7).createCell(quantitiesColumnIndex).setCellValue(totalBookCopies - totalBookCopiesReserved);
    }

    private void createExcelTotalBooksPieChart(XSSFSheet sheet) {
        // Create a pie chart
        XSSFDrawing drawing = sheet.createDrawingPatriarch();
        XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 3, 3, 7, 13); // Adjust the anchor position accordingly
        XSSFChart chart = drawing.createChart(anchor);

        // Create data for the pie chart
        XDDFDataSource<String> categories = XDDFDataSourcesFactory.fromStringCellRange(sheet, new CellRangeAddress(4, 5, 0, 0));
        XDDFNumericalDataSource<Double> values = XDDFDataSourcesFactory.fromNumericCellRange(sheet, new CellRangeAddress(4, 5, 1, 1));

        XDDFChartData data = chart.createData(ChartTypes.PIE, null, null);
        data.setVaryColors(true);
        data.addSeries(categories, values);
        chart.plot(data);

        // Customize the chart
        XDDFChartLegend legend = chart.getOrAddLegend();
        legend.setPosition(LegendPosition.TOP_RIGHT);
    }

    private void createExcelTotalBookCopiesPieChart(XSSFSheet sheet) {
        // Create a pie chart
        XSSFDrawing drawing = sheet.createDrawingPatriarch();
        XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 3, 14, 7, 24); // Adjust the anchor position accordingly
        XSSFChart chart = drawing.createChart(anchor);

        // Create data for the pie chart
        XDDFDataSource<String> categories = XDDFDataSourcesFactory.fromStringCellRange(sheet, new CellRangeAddress(6, 7, 0, 0));
        XDDFNumericalDataSource<Double> values = XDDFDataSourcesFactory.fromNumericCellRange(sheet, new CellRangeAddress(6, 7, 1, 1));

        XDDFChartData data = chart.createData(ChartTypes.PIE, null, null);
        data.setVaryColors(true);
        data.addSeries(categories, values);
        chart.plot(data);

        // Customize the chart
        XDDFChartLegend legend = chart.getOrAddLegend();
        legend.setPosition(LegendPosition.TOP_RIGHT);
    }
}
