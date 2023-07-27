package com.library.Library_Back_End.book.BookExport;

import com.itextpdf.text.DocumentException;
import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.reservation.ReservationRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xddf.usermodel.chart.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Component
public abstract class BookExport {
    protected final AuditingConfig auditingConfig;
    protected final BookRepository bookRepository;
    protected final ReservationRepository reservationRepository;

    @Autowired
    public BookExport(AuditingConfig auditingConfig, BookRepository bookRepository, ReservationRepository reservationRepository) {
        this.auditingConfig = auditingConfig;
        this.bookRepository = bookRepository;
        this.reservationRepository = reservationRepository;
    }

    public abstract byte[] generateFile() throws IOException, DocumentException;
}
