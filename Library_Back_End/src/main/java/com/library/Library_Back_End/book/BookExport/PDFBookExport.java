package com.library.Library_Back_End.book.BookExport;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.reservation.ReservationRepository;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.CategoryDataset;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Component
public class PDFBookExport extends BookExport {
    public PDFBookExport(AuditingConfig auditingConfig, BookRepository bookRepository, ReservationRepository reservationRepository) {
        super(auditingConfig, bookRepository, reservationRepository);
    }

    public byte[] generateFile() {
        try {
            List<Book> books = bookRepository.findAll();

            // Create a new Document
            Document document = new Document();

            // Create a ByteArrayOutputStream to write the PDF content to a byte array
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

            // Create a PdfWriter to write the content to the ByteArrayOutputStream
            PdfWriter.getInstance(document, byteArrayOutputStream);

            // Open the Document
            document.open();

            // Add a Paragraph to the Document with the signature
            document.add(new Paragraph("Exported by: " + auditingConfig.getAuditor().getUsername()));
            document.add(new Paragraph("Exported date: " + new Date()));
            document.add(new Paragraph(" "));

            // Add a table to the Document with the data from the books list
            PdfPTable table = createTable(books);
            document.add(table);

            // Add a Books chart to the Document
            JFreeChart bookChart = createPDFTotalBooksPieChart();
            BufferedImage bookChartImage = bookChart.createBufferedImage(500, 300);
            Image bookChartPdfImage = Image.getInstance(bookChartImage, null);
            document.add(bookChartPdfImage);

            // Add a Book Copies chart to the Document
            JFreeChart bookCopiesChart = createExcelTotalBookCopiesPieChart();
            BufferedImage bookCopiesChartImage = bookCopiesChart.createBufferedImage(500, 300);
            Image bookCopiesChartPdfImage = Image.getInstance(bookCopiesChartImage, null);
            document.add(bookCopiesChartPdfImage);

            // Close the Document
            document.close();

            // Get the byte array containing the PDF content
            return byteArrayOutputStream.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private PdfPTable createTable(List<Book> books) {
        PdfPTable table = new PdfPTable(8); // 4 columns for id, title, quantity, and genre
        table.setWidthPercentage(100); // Table width to take the full page width

        // Add table headers
        table.addCell("ID");
        table.addCell("Title");
        table.addCell("Quantity");
        table.addCell("Genre");
        table.addCell("Created By");
        table.addCell("Creation Date");
        table.addCell("Last Modified By");
        table.addCell("Last Modified Date");

        // Add data rows
        for (Book book : books) {
            table.addCell(String.valueOf(book.getId()));
            table.addCell(book.getTitle());
            table.addCell(String.valueOf(book.getQuantity()));
            table.addCell(book.getGenre().toString());
            table.addCell(book.getCreatedBy().getUsername());
            table.addCell(book.getCreationDate().toString());
            table.addCell(book.getLastModifiedBy().getUsername());
            table.addCell(book.getLastModifiedDate().toString());
        }

        return table;
    }

    private JFreeChart createPDFTotalBooksPieChart() {
        long totalBooks = bookRepository.count();
        long totalZeroQuantityBooks = bookRepository.countByQuantity(0);

        // Create a sample dataset for the pie chart
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        dataset.setValue("Books", totalBooks);
        dataset.setValue("Available Books", totalBooks - totalZeroQuantityBooks);

        // Create and return the chart
        return ChartFactory.createPieChart(
                "Books",
                dataset,
                true,
                true,
                false
        );
    }

    private JFreeChart createExcelTotalBookCopiesPieChart() {
        int totalBookCopiesNotReserved = bookRepository.sumQuantity();
        long totalBookCopiesReserved = reservationRepository.count();
        long totalBookCopies = totalBookCopiesNotReserved + totalBookCopiesReserved;

        // Create a sample dataset for the pie chart
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        dataset.setValue("Book Copies", totalBookCopies);
        dataset.setValue("Available Book Copies", totalBookCopies - totalBookCopiesReserved);

        // Create and return the chart
        return ChartFactory.createPieChart(
                "Book Copies",
                dataset,
                true,
                true,
                false
        );
    }
}
