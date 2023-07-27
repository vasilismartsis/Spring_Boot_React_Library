package com.library.Library_Back_End.book.BookExport;

import com.aspose.slides.*;
import com.itextpdf.text.DocumentException;
import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.reservation.ReservationRepository;
import org.apache.poi.xddf.usermodel.chart.*;
import org.apache.poi.xslf.usermodel.*;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Component
public class PPTXBookExport extends BookExport {
    public PPTXBookExport(AuditingConfig auditingConfig, BookRepository bookRepository, ReservationRepository reservationRepository) {
        super(auditingConfig, bookRepository, reservationRepository);
    }

    @Override
    public byte[] generateFile() throws IOException, DocumentException {
        Presentation pres = new Presentation();

        ISlideCollection slds = pres.getSlides();

        // Access first 2 slides
        ISlide bookSlide = slds.get_Item(0);
        ISlide chartSlide = slds.addEmptySlide(pres.getLayoutSlides().get_Item(1));

        // Add signature
        addSignatureTextBox(bookSlide);

        // Add book table
        addBookTable(bookSlide);

        // Add charts
        addTotalBooksPieChart(chartSlide);
        addTotalBookCopiesPieChart(chartSlide);

// Save the presentation as a byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        pres.save(baos, SaveFormat.Pptx);
        byte[] pptxBytes = baos.toByteArray();

        return pptxBytes;
    }

    private void addSignatureTextBox(ISlide slide) {
        // Create a text box shape
        IAutoShape textBox = slide.getShapes().addAutoShape(ShapeType.Rectangle, 50, 50, 400, 50);

        // Set the text content and style for the signature
        textBox.getTextFrame().setText("Exported by: " + auditingConfig.getAuditor().getUsername() + "\nExported date: " + new Date());

        // Getting the first paragraph of the placeholders
        IParagraph para1 = textBox.getTextFrame().getParagraphs().get_Item(0);

        // Aligning the text paragraph to center
        para1.getParagraphFormat().setAlignment(TextAlignment.Left);

        // Set the text box fill color and outline color (you can customize these colors as per your preference)
        textBox.getFillFormat().setFillType(FillType.NoFill);
        textBox.getShapeStyle().getLineColor().setColor(Color.WHITE);

        // Set font properties for the text
        ITextFrame textFrame = textBox.getTextFrame();
        IPortion portion = textFrame.getParagraphs().get_Item(0).getPortions().get_Item(0);
        portion.getPortionFormat().getFillFormat().setFillType(FillType.Solid);
        portion.getPortionFormat().getFillFormat().getSolidFillColor().setColor(Color.BLACK);

    }

    private void addBookTable(ISlide slide) {
        List<Book> books = bookRepository.findAll();

// Add a new table shape to the slide and set its dimensions
        double[] dblCols = {90, 90, 90, 90, 90, 90, 90};
        double[] dblRows = new double[books.size() + 1];
        for (int i = 0; i < books.size() + 1; i++) {
            dblRows[i] = 10;
        }
        ITable table = slide.getShapes().addTable(50, 100, dblCols, dblRows);
// Loop through the books and fill the table cells
        for (int i = 0; i < books.size() + 1; i++) {
            // Loop through the columns
            for (int j = 0; j < 7; j++) {
                // Access the cell
                ICell cell = table.getRows().get_Item(i).get_Item(j);
                // Set the cell text
                if (i == 0) {
                    // This is the header row, set the column names
                    switch (j) {
                        case 0:
                            cell.getTextFrame().setText("Title");
                            break;
                        case 1:
                            cell.getTextFrame().setText("Quantity");
                            break;
                        case 2:
                            cell.getTextFrame().setText("Genre");
                            break;
                        case 3:
                            cell.getTextFrame().setText("Created By");
                            break;
                        case 4:
                            cell.getTextFrame().setText("Creation Date");
                            break;
                        case 5:
                            cell.getTextFrame().setText("Last Modified By");
                            break;
                        case 6:
                            cell.getTextFrame().setText("Last Modified Date");
                            break;
                    }
                } else {
                    // This is a data row, set the book attributes
                    Book book = books.get(i - 1); // get the book at index i - 1
                    switch (j) {
                        case 0:
                            cell.getTextFrame().setText(book.getTitle());
                            break;
                        case 1:
                            cell.getTextFrame().setText(String.valueOf(book.getQuantity()));
                            break;
                        case 2:
                            cell.getTextFrame().setText(book.getGenre().toString());
                            break;
                        case 3:
                            cell.getTextFrame().setText(book.getCreatedBy().getUsername());
                            break;
                        case 4:
                            cell.getTextFrame().setText(book.getCreationDate().toString());
                            break;
                        case 5:
                            cell.getTextFrame().setText(book.getLastModifiedBy().getUsername());
                            break;
                        case 6:
                            cell.getTextFrame().setText(book.getLastModifiedDate().toString());
                            break;
                    }
                }
                // Set cell font size
                cell.getTextFrame().getParagraphs().get_Item(0).getPortions().get_Item(0).getPortionFormat().setFontHeight(10);
            }
        }

    }

    private void addTotalBooksPieChart(ISlide slide) {
        long totalBooks = bookRepository.count();
        long totalZeroQuantityBooks = bookRepository.countByQuantity(0);

        // Add chart with default data
        IChart chart = slide.getShapes().addChart(ChartType.Pie, 50, 150, 300, 300);

        // Set chart Title
        chart.getChartTitle().addTextFrameForOverriding("Books");
        chart.getChartTitle().getTextFrameForOverriding().getTextFrameFormat().setCenterText(NullableBool.True);
        chart.getChartTitle().setHeight(20);
        chart.setTitle(true);

        // Set first series to Show Values
        chart.getChartData().getSeries().get_Item(0).getLabels().getDefaultDataLabelFormat().setShowValue(true);

        // Set the index of chart data sheet
        int defaultWorksheetIndex = 0;

        // Get the chart data worksheet
        IChartDataWorkbook fact = chart.getChartData().getChartDataWorkbook();

        // Delete default generated series and categories
        chart.getChartData().getSeries().clear();
        chart.getChartData().getCategories().clear();

        // Add new categories
        chart.getChartData().getCategories().add(fact.getCell(0, 1, 0, "Books"));
        chart.getChartData().getCategories().add(fact.getCell(0, 2, 0, "Available Books"));

        // Add new series
        IChartSeries series = chart.getChartData().getSeries().add(fact.getCell(0, 0, 1, "Books"), chart.getType());

        // Now populating series data
        series.getDataPoints().addDataPointForPieSeries(fact.getCell(defaultWorksheetIndex, 1, 1, totalBooks));
        series.getDataPoints().addDataPointForPieSeries(fact.getCell(defaultWorksheetIndex, 2, 1, totalBooks - totalZeroQuantityBooks));

        // Not working in new version
        // Adding new points and setting sector color
        // series.IsColorVaried = true;
        chart.getChartData().getSeriesGroups().get_Item(0).setColorVaried(true);

        IChartDataPoint point = series.getDataPoints().get_Item(0);
        point.getFormat().getFill().setFillType(FillType.Solid);
        point.getFormat().getFill().getSolidFillColor().setColor(Color.CYAN);

        // Set Sector border
        point.getFormat().getLine().getFillFormat().setFillType(FillType.Solid);
        point.getFormat().getLine().getFillFormat().getSolidFillColor().setColor(Color.GRAY);
        point.getFormat().getLine().setWidth(3.0);
        //point.getFormat().getLine().setStyle(LineStyle.ThinThick);
        //point.getFormat().getLine().setDashStyle(LineDashStyle.DashDot);

        IChartDataPoint point1 = series.getDataPoints().get_Item(1);
        point1.getFormat().getFill().setFillType(FillType.Solid);
        point1.getFormat().getFill().getSolidFillColor().setColor(Color.ORANGE);

        // Set Sector border
        point1.getFormat().getLine().getFillFormat().setFillType(FillType.Solid);
        point1.getFormat().getLine().getFillFormat().getSolidFillColor().setColor(Color.BLUE);
        point1.getFormat().getLine().setWidth(3.0);
        //point1.getFormat().getLine().setStyle(LineStyle.Single);
        //point1.getFormat().getLine().setDashStyle(LineDashStyle.LargeDashDot);

        // Create custom labels for each of categories for new series
        IDataLabel lbl = series.getDataPoints().get_Item(0).getLabel();
        IDataLabel lbl1 = series.getDataPoints().get_Item(1).getLabel();

        // lbl.ShowCategoryName = true;
        lbl.getDataLabelFormat().setShowValue(true);
        lbl1.getDataLabelFormat().setShowValue(true);

        // Show Leader Lines for Chart
        series.getLabels().getDefaultDataLabelFormat().setShowLeaderLines(true);

        // Set Rotation Angle for Pie Chart Sectors
        chart.getChartData().getSeriesGroups().get_Item(0).setFirstSliceAngle(180);
    }

    private void addTotalBookCopiesPieChart(ISlide slide) {
        int totalBookCopiesNotReserved = bookRepository.sumQuantity();
        long totalBookCopiesReserved = reservationRepository.count();
        long totalBookCopies = totalBookCopiesNotReserved + totalBookCopiesReserved;

        // Add chart with default data
        IChart chart = slide.getShapes().addChart(ChartType.Pie, 400, 150, 300, 300);

        // Set chart Title
        chart.getChartTitle().addTextFrameForOverriding("Book Copies");
        chart.getChartTitle().getTextFrameForOverriding().getTextFrameFormat().setCenterText(NullableBool.True);
        chart.getChartTitle().setHeight(20);
        chart.setTitle(true);

        // Set first series to Show Values
        chart.getChartData().getSeries().get_Item(0).getLabels().getDefaultDataLabelFormat().setShowValue(true);

        // Set the index of chart data sheet
        int defaultWorksheetIndex = 0;

        // Get the chart data worksheet
        IChartDataWorkbook fact = chart.getChartData().getChartDataWorkbook();

        // Delete default generated series and categories
        chart.getChartData().getSeries().clear();
        chart.getChartData().getCategories().clear();

        // Add new categories
        chart.getChartData().getCategories().add(fact.getCell(0, 1, 0, "Book Copies"));
        chart.getChartData().getCategories().add(fact.getCell(0, 2, 0, "Available Book Copies"));

        // Add new series
        IChartSeries series = chart.getChartData().getSeries().add(fact.getCell(0, 0, 1, "Book Copies"), chart.getType());

        // Now populating series data
        series.getDataPoints().addDataPointForPieSeries(fact.getCell(defaultWorksheetIndex, 1, 1, totalBookCopies));
        series.getDataPoints().addDataPointForPieSeries(fact.getCell(defaultWorksheetIndex, 2, 1, totalBookCopies - totalBookCopiesReserved));

        // Not working in new version
        // Adding new points and setting sector color
        // series.IsColorVaried = true;
        chart.getChartData().getSeriesGroups().get_Item(0).setColorVaried(true);

        IChartDataPoint point = series.getDataPoints().get_Item(0);
        point.getFormat().getFill().setFillType(FillType.Solid);
        point.getFormat().getFill().getSolidFillColor().setColor(Color.CYAN);

        // Set Sector border
        point.getFormat().getLine().getFillFormat().setFillType(FillType.Solid);
        point.getFormat().getLine().getFillFormat().getSolidFillColor().setColor(Color.GRAY);
        point.getFormat().getLine().setWidth(3.0);
        //point.getFormat().getLine().setStyle(LineStyle.ThinThick);
        //point.getFormat().getLine().setDashStyle(LineDashStyle.DashDot);

        IChartDataPoint point1 = series.getDataPoints().get_Item(1);
        point1.getFormat().getFill().setFillType(FillType.Solid);
        point1.getFormat().getFill().getSolidFillColor().setColor(Color.ORANGE);

        // Set Sector border
        point1.getFormat().getLine().getFillFormat().setFillType(FillType.Solid);
        point1.getFormat().getLine().getFillFormat().getSolidFillColor().setColor(Color.BLUE);
        point1.getFormat().getLine().setWidth(3.0);
        //point1.getFormat().getLine().setStyle(LineStyle.Single);
        //point1.getFormat().getLine().setDashStyle(LineDashStyle.LargeDashDot);

        // Create custom labels for each of categories for new series
        IDataLabel lbl = series.getDataPoints().get_Item(0).getLabel();
        IDataLabel lbl1 = series.getDataPoints().get_Item(1).getLabel();

        // lbl.ShowCategoryName = true;
        lbl.getDataLabelFormat().setShowValue(true);
        lbl1.getDataLabelFormat().setShowValue(true);

        // Show Leader Lines for Chart
        series.getLabels().getDefaultDataLabelFormat().setShowLeaderLines(true);

        // Set Rotation Angle for Pie Chart Sectors
        chart.getChartData().getSeriesGroups().get_Item(0).setFirstSliceAngle(180);
    }
}
