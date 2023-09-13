package com.library.Library_Back_End;

import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.reservation.Reservation;
import com.library.Library_Back_End.reservation.ReservationRepository;
import com.library.Library_Back_End.reservation.ReservationSpecifications;
import org.junit.jupiter.api.*;
import org.junit.platform.commons.logging.Logger;
import org.junit.platform.commons.logging.LoggerFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.List;

@SpringBootTest
public class LibraryEndToEndTest {
    @Value("${end.to.end.test.ip}")
    private String endToEndTestIp;
    private final ReservationRepository reservationRepository;
    private final LibraryUserRepository libraryUserRepository;
    private final ReservationSpecifications reservationSpecifications;

    Logger logger = LoggerFactory.getLogger(LibraryEndToEndTest.class);

    @Autowired
    public LibraryEndToEndTest(ReservationRepository reservationRepository, LibraryUserRepository libraryUserRepository, ReservationSpecifications reservationSpecifications) {
        this.reservationRepository = reservationRepository;
        this.libraryUserRepository = libraryUserRepository;
        this.reservationSpecifications = reservationSpecifications;
    }

    private WebDriver driver;

    @BeforeEach
    public void setUp() throws InterruptedException {

//        System.setProperty("webdriver.chrome.driver", chromedriverPath);
//        driver = new ChromeDriver();

        FirefoxOptions firefoxOptions = new FirefoxOptions();
        firefoxOptions.setHeadless(true); // Set to true for headless mode

        System.setProperty("webdriver.gecko.driver", "/usr/bin/geckodriver");
        driver = new FirefoxDriver(firefoxOptions);

        driver.manage().window().maximize();
        login("a", "a");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    public void login(String username, String password) throws InterruptedException {
        // Open the library web page
        driver.get(endToEndTestIp + "/login");

        Thread.sleep(2000);

        // Perform actions to navigate to the getBooks method
        WebElement LoginForm = driver.findElement(By.id("basic"));
        LoginForm.findElement(By.id("basic_username")).sendKeys(username);
        LoginForm.findElement(By.id("basic_password")).sendKeys(password);
        LoginForm.findElement(By.tagName("button")).click();

        Thread.sleep(2000);
    }


    @Test
    public void testGetBooksTableData() throws InterruptedException {
        driver.get(endToEndTestIp + "/books");

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

        // Example: Assert the number of columns in each row
        int expectedColumns = 5; // Assuming your table has 5 columns (id, title, genre, quantity, action)
        List<WebElement> columns = firstRow.findElements(By.cssSelector(".ant-table-cell"));
        Assertions.assertEquals(expectedColumns, columns.size());

        // Example: Assert the total number of books matches the expected count
        int expectedBookCount = 6; // Replace with your expected book count
        Assertions.assertEquals(expectedBookCount, bookRows.size());
    }

    @Test
    public void testSuccessfulReservation() throws InterruptedException {
        // Navigate to the page containing the BookList component
        driver.get(endToEndTestIp + "/books");

        Thread.sleep(2000);

        // Locate and click the "Reserve" button for a book
        WebElement reserveButton = driver.findElement(By.xpath("//*[contains(text(), 'Reserve')]"));
        reserveButton.click();

        Thread.sleep(1000);

        // Verify the success message
        WebElement successMessage = driver.findElement(By.xpath("//span[contains(text(), 'You have successfully reserved this book!')]"));
        Assertions.assertTrue(successMessage.isDisplayed());
    }

    @Test
    public void testSearchFunctionOnBookTable() throws InterruptedException {
        driver.get(endToEndTestIp + "/books");

        Thread.sleep(2000);

        WebElement titleSearchButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div[4]/div/div/div/div/div/table/thead/tr/th[2]/div/span[2]"));
        titleSearchButton.click();

        Thread.sleep(1000);

        WebElement searchInput = driver.findElement(By.xpath("//input[@placeholder='Search column']"));
        searchInput.sendKeys("C");

        Thread.sleep(1000);

        // Assuming the book list is displayed in a table
        WebElement bookTable = driver.findElement(By.tagName("table"));
        List<WebElement> bookRows = bookTable.findElements(By.tagName("tr"));

        // Assert that there are at least some books in the list
        Assertions.assertTrue(bookRows.size() > 0);

        // Example: Assert specific book title in the first row
        WebElement firstRow = bookRows.get(1);
        WebElement titleCell = firstRow.findElement(By.cssSelector(".ant-table-cell:nth-child(2)")); // Assuming title is in the second column
        String expectedTitle = "Secrets of the Cryptic Manor"; // Replace with your expected title
        Assertions.assertEquals(expectedTitle, titleCell.getText());

        // Example: Assert specific genre in the first row
        WebElement genreCell = firstRow.findElement(By.cssSelector(".ant-table-cell:nth-child(3)")); // Assuming genre is in the third column
        String expectedGenre = "MYSTERY"; // Replace with your expected genre
        Assertions.assertEquals(expectedGenre, genreCell.getText());

        // Example: Assert the total number of books matches the expected count
        int expectedBookCount = 4; // Replace with your expected book count
        Assertions.assertEquals(expectedBookCount, bookRows.size());
    }

    @Test
    public void testMyReservationsTableData() throws InterruptedException {
        driver.get(endToEndTestIp + "/profile/my-reservations");

        Thread.sleep(2000);

        // Assuming the reservation list is displayed in a table
        WebElement reservationTable = driver.findElement(By.tagName("table"));
        List<WebElement> reservationRows = reservationTable.findElements(By.tagName("tr"));

        // Assert that there are at least some reservations in the list
        Assertions.assertTrue(reservationRows.size() > 1);

        LibraryUser libraryUser = libraryUserRepository.findByUsername("a").orElseThrow();

        Page<Reservation> reservationPage = reservationRepository.findAll(reservationSpecifications.findAllByLibraryUser(libraryUser), PageRequest.of(0, 5));

        List<Reservation> reservations = reservationPage.getContent();

        // Check if ids on client table are the expected ids
        for (int i = 0; i < reservationRows.size() - 1; i++) {
            WebElement idCell = reservationRows.get(i + 1).findElement(By.cssSelector(".ant-table-cell:nth-child(1)"));
            Assertions.assertEquals(reservations.get(i).getId(), Integer.parseInt(idCell.getText()));
        }
    }

    @Test
    public void testSuccessfulReservationDeletion() throws InterruptedException {
        // Navigate to the page containing the BookList component
        driver.get(endToEndTestIp + "/reservations");

        Thread.sleep(2000);

        // Locate and click the "Reserve" button for a book
        List<WebElement> reserveButton = driver.findElements(By.xpath("//*[contains(text(), 'Delete')]"));
        reserveButton.get(reserveButton.size() - 1).click();

        Thread.sleep(3000);

        WebElement yesButton = driver.findElement(By.xpath("//*[contains(text(), 'Yes')]"));
        yesButton.click();

        Thread.sleep(1000);

        // Verify the success message
        WebElement successMessage = driver.findElement(By.xpath("//span[contains(text(), 'Reservation deleted successfully')]"));
        Assertions.assertTrue(successMessage.isDisplayed());
    }

    @Test
    public void testOnlyAdminCanAccessAdminPages() throws InterruptedException {
        login("user", "password");

        driver.get(endToEndTestIp + "/reservations");

        Thread.sleep(2000);

        // Assuming the reservation list is displayed in a table
        WebElement homePageTitle = driver.findElement((By.xpath("//h1[contains(text(), 'Login')]")));

        Assertions.assertEquals(homePageTitle.getText(), "Login");
    }
}