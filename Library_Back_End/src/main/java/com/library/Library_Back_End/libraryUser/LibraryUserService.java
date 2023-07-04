package com.library.Library_Back_End.libraryUser;

import com.library.Library_Back_End.libraryUser.dto.ChangePasswordRequest;
import com.library.Library_Back_End.libraryUser.dto.LibraryUserResponse;
import com.library.Library_Back_End.libraryUser.dto.SingleLibraryUserResponse;
import com.library.Library_Back_End.login.LoginService;
import com.library.Library_Back_End.login.dto.LoginAuthResponse;
import com.library.Library_Back_End.login.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibraryUserService implements UserDetailsService {
    private final LibraryUserRepository libraryUserRepository;
    private final LibraryUserConfiguration libraryUserConfiguration;

    private final LibraryUserSpecifications libraryUserSpecifications;

    private final LoginService loginService;

    PasswordEncoder passwordEncoder;

    @Autowired
    public LibraryUserService(LibraryUserRepository libraryUserRepository, LibraryUserConfiguration libraryUserConfiguration, @Lazy LoginService loginService, PasswordEncoder passwordEncoder) {
        this.libraryUserRepository = libraryUserRepository;
        this.libraryUserConfiguration = libraryUserConfiguration;
        this.loginService = loginService;
        this.passwordEncoder = passwordEncoder;
        libraryUserSpecifications = new LibraryUserSpecifications();
        saveDummyLibraryUsers();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LibraryUser libraryUser = libraryUserRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        return new org.springframework.security.core.userdetails.User(libraryUser.getUsername(), libraryUser.getPassword(), mapRolesToAuthorities(libraryUser.getRole()));
    }

    private Collection<GrantedAuthority> mapRolesToAuthorities(List<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getRole().toString())).collect(Collectors.toList());
    }

    public void saveDummyLibraryUsers() {
        libraryUserRepository.saveAll(libraryUserConfiguration.libraryUsers());
    }

    @Transactional
    public ResponseEntity<LoginAuthResponse> changePassword(ChangePasswordRequest changePasswordRequest) {
        if (loginService.login(new LoginRequest(changePasswordRequest.getUsername(), changePasswordRequest.getCurrentPassword())).getStatusCode() == HttpStatus.OK) {
            try {
                String encodedPassword = passwordEncoder.encode(changePasswordRequest.getNewPassword());
                LibraryUser libraryUser = libraryUserRepository.findByUsername(changePasswordRequest.getUsername()).orElseThrow();
                libraryUser.setPassword(encodedPassword);
                libraryUserRepository.save(libraryUser);
                return loginService.login(new LoginRequest(changePasswordRequest.getUsername(), changePasswordRequest.getNewPassword()));
            } catch (Exception e) {
                return new ResponseEntity<>(new LoginAuthResponse("Something went wrong when the server tried to save your new password!"), HttpStatus.CONFLICT);
            }
        } else {
            return new ResponseEntity<>(new LoginAuthResponse("Wrong Current Password!"), HttpStatus.UNAUTHORIZED);
        }
    }

    public LibraryUserResponse getUsers(int page, String order, String sortedColumn, String searchColumn, String searchValue) {
        long totalLibraryUserNumber = libraryUserRepository.count();

        Sort.Direction sortDirection = order.equals("descend") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String noNullSortedColumn = sortedColumn.equals("undefined") ? "id" : sortedColumn;
        Sort sort = Sort.by(sortDirection, noNullSortedColumn);
        Pageable pageable = !order.equals("undefined") ? PageRequest.of(page - 1, 5, sort) : PageRequest.of(page - 1, 5);

        Page<LibraryUser> libraryUserPage;
        if (!searchColumn.equals("")) {
            libraryUserPage = libraryUserRepository.findAll(libraryUserSpecifications.findAllByColumnContaining(searchColumn, searchValue), pageable);
        } else {
            libraryUserPage = libraryUserRepository.findAll(pageable);
        }
        List<SingleLibraryUserResponse> singleLibraryUserResponse = libraryUserPage
                .stream()
                .map(entity -> new SingleLibraryUserResponse(
                        entity.getCreatedBy() != null ? libraryUserRepository.findById(entity.getCreatedBy().getId()).orElseThrow().getUsername() : null,
                        entity.getLastModifiedBy() != null ? libraryUserRepository.findById(entity.getLastModifiedBy().getId()).orElseThrow().getUsername() : null,
                        entity.getCreationDate(),
                        entity.getLastModifiedDate(),
                        entity.getId(),
                        entity.getUsername())
                    )
                .toList();

        return new LibraryUserResponse(totalLibraryUserNumber, singleLibraryUserResponse);
    }
}