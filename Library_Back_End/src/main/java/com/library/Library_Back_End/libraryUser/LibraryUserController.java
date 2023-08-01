package com.library.Library_Back_End.libraryUser;

import com.library.Library_Back_End.libraryUser.dto.*;
import com.library.Library_Back_End.login.LoginHeader;
import com.library.Library_Back_End.login.LoginService;
import com.library.Library_Back_End.login.dto.LoginAuthResponse;
import com.library.Library_Back_End.login.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "api/user")
public class LibraryUserController {
    private final LibraryUserService libraryUserService;
    private final LoginService loginService;

    @Autowired
    public LibraryUserController(LibraryUserService libraryUserService, LoginService loginService) {
        this.libraryUserService = libraryUserService;
        this.loginService = loginService;
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

    @PostMapping("/editUser")
    public ResponseEntity<String> editUser(@RequestBody EditLibraryUserRequest editLibraryUserRequest) {
        try {
            libraryUserService.editUser(editLibraryUserRequest);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestBody AddLibraryUserRequest addLibraryUserRequest) {
        try {
            libraryUserService.addUser(addLibraryUserRequest);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestBody DeleteLibraryUserRequest deleteLibraryUserRequest) {
        try {
            libraryUserService.deleteUser(deleteLibraryUserRequest);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<LoginAuthResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            // Try to log in
            loginService.login(new LoginRequest(changePasswordRequest.getUsername(), changePasswordRequest.getCurrentPassword()));

            // If login successful, change the password
            libraryUserService.changePassword(changePasswordRequest);

            // After changing the password, generate a new token for the user
            LoginHeader newLoginHeader = loginService.login(new LoginRequest(changePasswordRequest.getUsername(), changePasswordRequest.getNewPassword()));

            return new ResponseEntity<>(new LoginAuthResponse(newLoginHeader.getToken(), newLoginHeader.getRole()), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(new LoginAuthResponse("Wrong Current Password!"), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(new LoginAuthResponse("Something went wrong when the server tried to save your new password!"), HttpStatus.CONFLICT);
        }
    }
}
