package com.library.Library_Back_End.libraryUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import java.util.ArrayList;

@Configuration
public class LibraryUserConfiguration {
    @Autowired
    PasswordEncoder passwordEncoder;

    public ArrayList<LibraryUser> libraryUsers() {
        ArrayList<LibraryUser> libraryUsers = new ArrayList<LibraryUser>();
        libraryUsers.add(new LibraryUser(
                "user",
                passwordEncoder.encode("password"),
                List.of(new Role(RoleEnum.CUSTOMER))
        ));
        libraryUsers.add(new LibraryUser(
                "a",
                passwordEncoder.encode("a"),
                List.of(new Role(RoleEnum.ADMIN))
        ));

        return libraryUsers;
    }
}
