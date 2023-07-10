package com.library.Library_Back_End.libraryUser;

import com.library.Library_Back_End.libraryUser.dto.ChangePasswordRequest;
import com.library.Library_Back_End.libraryUser.dto.LibraryUserResponse;
import com.library.Library_Back_End.libraryUser.dto.UpdateLibraryUserRequest;
import com.library.Library_Back_End.login.dto.LoginAuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping(path = "api/user")
public class LibraryUserController {
    private final LibraryUserService libraryUserService;

    @Autowired
    public LibraryUserController(LibraryUserService libraryUserService) {
        this.libraryUserService = libraryUserService;
    }

    @GetMapping("/getUsers")
    public LibraryUserResponse getUsers(
            @RequestParam List<String> selectedRoles,
            @RequestParam int page,
            @RequestParam String order,
            @RequestParam String sortedColumn,
            @RequestParam String searchColumn,
            @RequestParam String searchValue
    ) {
        return libraryUserService.getUsers(selectedRoles, page, order, sortedColumn, searchColumn, searchValue);
    }

    @GetMapping("/getRoles")
    public RoleEnum[] getRoles() {
        return libraryUserService.getRoles();
    }

    @PostMapping("/updateUser")
    public HttpStatus updateUser(@RequestBody UpdateLibraryUserRequest updateLibraryUserRequest) {
        return libraryUserService.updateUser(updateLibraryUserRequest);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<LoginAuthResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        return libraryUserService.changePassword(changePasswordRequest);
    }
}
