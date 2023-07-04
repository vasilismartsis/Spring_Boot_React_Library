package com.library.Library_Back_End.libraryUser;

import com.library.Library_Back_End.libraryUser.dto.ChangePasswordRequest;
import com.library.Library_Back_End.libraryUser.dto.LibraryUserResponse;
import com.library.Library_Back_End.login.dto.LoginAuthResponse;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/user")
public class LibraryUserController {
    private final LibraryUserService libraryUserService;

    @Autowired
    public LibraryUserController(LibraryUserService libraryUserService) {
        this.libraryUserService = libraryUserService;
    }

    @GetMapping("/getUsers")
    public LibraryUserResponse getUsers(@RequestParam int page,
                                        @RequestParam String order,
                                        @RequestParam String sortedColumn,
                                        @RequestParam String searchColumn,
                                        @RequestParam String searchValue) {
        return libraryUserService.getUsers(page, order, sortedColumn, searchColumn, searchValue);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<LoginAuthResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        return libraryUserService.changePassword(changePasswordRequest);
    }
}
