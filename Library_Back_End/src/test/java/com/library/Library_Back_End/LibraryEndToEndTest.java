package com.library.Library_Back_End;

import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.reservation.Reservation;
import com.library.Library_Back_End.reservation.ReservationRepository;
import com.library.Library_Back_End.reservation.ReservationSpecifications;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.Duration;
import java.util.List;

@SpringBootTest
public class LibraryEndToEndTest {
    private final ReservationRepository reservationRepository;
    private final LibraryUserRepository libraryUserRepository;
    private final ReservationSpecifications reservationSpecifications;

    @Autowired
    public LibraryEndToEndTest(ReservationRepository reservationRepository, LibraryUserRepository libraryUserRepository, ReservationSpecifications reservationSpecifications) {
        this.reservationRepository = reservationRepository;
        this.libraryUserRepository = libraryUserRepository;
        this.reservationSpecifications = reservationSpecifications;
    }

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        // Set the path to your ChromeDriver executable
        System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
        driver = new ChromeDriver();
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testGetBooks() throws InterruptedException {
        login();
        getBooks();
        getMyReservations();
        // You can further validate the book details as needed
    }

    public void login() throws InterruptedException {
        // Open the library web page
        driver.get("http://localhost:3000/login");

        // Perform actions to navigate to the getBooks method

        WebElement LoginForm = driver.findElement(By.id("basic"));
        LoginForm.findElement(By.id("basic_username")).sendKeys("a");
        LoginForm.findElement(By.id("basic_password")).sendKeys("a");
        LoginForm.findElement(By.tagName("button")).click();

        Thread.sleep(2000);
    }

    public void getBooks() throws InterruptedException {
        driver.get("http://localhost:3000/books");

        Thread.sleep(2000);

        // Assuming the book list is displayed in a table
        WebElement bookTable = driver.findElement(By.tagName("table"));
        List<WebElement> bookRows = bookTable.findElements(By.tagName("tr"));

        // Assert that there are at least some books in the list
        Assertions.assertTrue(bookRows.size() > 0);

        // Example: Assert specific book title in the first row
        WebElement firstRow = bookRows.get(1);
        WebElement titleCell = firstRow.findElement(By.cssSelector(".ant-table-cell:nth-child(2)")); // Assuming title is in the second column
        String expectedTitle = "The Enigma of Eternal Love"; // Replace with your expected title
        Assertions.assertEquals(expectedTitle, titleCell.getText());

        // Example: Assert specific genre in the first row
        WebElement genreCell = firstRow.findElement(By.cssSelector(".ant-table-cell:nth-child(3)")); // Assuming genre is in the third column
        String expectedGenre = "ROMANCE"; // Replace with your expected genre
        Assertions.assertEquals(expectedGenre, genreCell.getText());

        // You can add more assertions for other book details as needed

        // Example: Assert the number of columns in each row
        int expectedColumns = 5; // Assuming your table has 5 columns (id, title, genre, quantity, action)
        List<WebElement> columns = firstRow.findElements(By.cssSelector(".ant-table-cell"));
        Assertions.assertEquals(expectedColumns, columns.size());

        // Example: Assert the total number of books matches the expected count
        int expectedBookCount = 6; // Replace with your expected book count
        Assertions.assertEquals(expectedBookCount, bookRows.size());
    }

    public void getMyReservations() throws InterruptedException {
        driver.get("http://localhost:3000/profile/my-reservations");

        Thread.sleep(2000);

        // Assuming the reservation list is displayed in a table
        WebElement reservationTable = driver.findElement(By.tagName("table"));
        List<WebElement> reservationRows = reservationTable.findElements(By.tagName("tr"));

        // Assert that there are at least some reservations in the list
        Assertions.assertTrue(reservationRows.size() > 0);

        LibraryUser libraryUser = libraryUserRepository.findByUsername("a").orElseThrow();

        Page<Reservation> reservationPage = reservationRepository.findAll(reservationSpecifications.findAllByLibraryUser(libraryUser), PageRequest.of(0, 5));

        List<Reservation> reservations = reservationPage.getContent();

        // Check if ids on client table are the expected ids
        for (int i = 0; i < reservationRows.size() - 1; i++) {
            WebElement idCell = reservationRows.get(i + 1).findElement(By.cssSelector(".ant-table-cell:nth-child(1)"));
            Assertions.assertEquals(reservations.get(i).getId(), Integer.parseInt(idCell.getText()));
        }
    }
}