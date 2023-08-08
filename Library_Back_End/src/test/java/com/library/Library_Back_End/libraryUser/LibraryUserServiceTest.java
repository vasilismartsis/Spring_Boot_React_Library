package com.library.Library_Back_End.libraryUser;

import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.libraryUser.dto.*;
import com.library.Library_Back_End.login.LoginService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class LibraryUserServiceTest {
    @Mock
    private LibraryUserRepository libraryUserRepository;
    @Mock
    private LibraryUserSpecifications libraryUserSpecifications;
    @Mock
    private LoginService loginService;
    @Mock
    private AuditingConfig auditingConfig;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private LibraryUserService libraryUserService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername_ExistingUser() {
        LibraryUser user = new LibraryUser("testuser", "testpassword", Collections.emptyList(), null, null);
        when(libraryUserRepository.findByUsername("testuser")).thenReturn(java.util.Optional.of(user));

        UserDetails userDetails = libraryUserService.loadUserByUsername("testuser");

        assertEquals("testuser", userDetails.getUsername());
        assertEquals("testpassword", userDetails.getPassword());
        assertEquals(0, userDetails.getAuthorities().size());
    }

    @Test
    void testLoadUserByUsername_NonExistingUser() {
        when(libraryUserRepository.findByUsername(anyString())).thenReturn(java.util.Optional.empty());

        try {
            libraryUserService.loadUserByUsername("testuser");
        } catch (UsernameNotFoundException ex) {
            assertEquals("Username not found", ex.getMessage());
        }
    }

    @Test
    void testGetUsers() {
        List<String> selectedRoles = List.of("CUSTOMER");
        int page = 1;
        String order = "ascend";
        String sortedColumn = "username";
        String searchColumn = "";
        String searchValue = "";

        LibraryUser user1 = new LibraryUser("user1", "password1", Arrays.asList(new Role(RoleEnum.CUSTOMER)));
        LibraryUser user2 = new LibraryUser("user2", "password2", Arrays.asList(new Role(RoleEnum.ADMIN)));
        Page<LibraryUser> userPage = new PageImpl<>(Arrays.asList(user1, user2));

        when(libraryUserRepository.count()).thenReturn(2L);
        Specification<LibraryUser> mockSpecification = mock(Specification.class);
        when(libraryUserSpecifications.findAllByRole(any(List.class))).thenReturn(mockSpecification);
        when(libraryUserRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class))).thenReturn(userPage);

        LibraryUserResponse response = libraryUserService.getUsers(selectedRoles, page, order, sortedColumn, searchColumn, searchValue);

        assertEquals(2L, response.getTotalLibraryUsers());
        assertEquals(2, response.getSingleLibraryUserResponse().size());
        assertEquals("user1", response.getSingleLibraryUserResponse().get(0).getUsername());
        assertEquals("user2", response.getSingleLibraryUserResponse().get(1).getUsername());
    }

    @Test
    void testGetUsersWithSearchValue() {
        List<String> selectedRoles = Collections.emptyList();
        int page = 1;
        String order = "ascend";
        String sortedColumn = "username";
        String searchColumn = "username";
        String searchValue = "user";

        LibraryUser user1 = new LibraryUser("user1", "password1", Arrays.asList(new Role(RoleEnum.CUSTOMER)), null, null);
        LibraryUser user2 = new LibraryUser("user2", "password2", Arrays.asList(new Role(RoleEnum.ADMIN)), null, null);
        Page<LibraryUser> userPage = new PageImpl<>(Arrays.asList(user1, user2));

        when(libraryUserRepository.count()).thenReturn(2L);
        Specification<LibraryUser> mockSpecification = mock(Specification.class);
        when(libraryUserSpecifications.findAllByColumnContaining(any(String.class), any(String.class))).thenReturn(mockSpecification);
        when(libraryUserRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class))).thenReturn(userPage);

        LibraryUserResponse response = libraryUserService.getUsers(selectedRoles, page, order, sortedColumn, searchColumn, searchValue);

        assertEquals(2L, response.getTotalLibraryUsers());
        assertEquals(2, response.getSingleLibraryUserResponse().size());
        assertEquals("user1", response.getSingleLibraryUserResponse().get(0).getUsername());
        assertEquals("user2", response.getSingleLibraryUserResponse().get(1).getUsername());
    }

    @Test
    void testGetUsersWithRoleAndSearchValue() {
        List<String> selectedRoles = Arrays.asList("ADMIN");
        int page = 1;
        String order = "ascend";
        String sortedColumn = "username";
        String searchColumn = "username";
        String searchValue = "user";

        LibraryUser user1 = new LibraryUser("user1", "password1", Arrays.asList(new Role(RoleEnum.CUSTOMER)), null, null);
        LibraryUser user2 = new LibraryUser("user2", "password2", Arrays.asList(new Role(RoleEnum.ADMIN)), null, null);
        Page<LibraryUser> userPage = new PageImpl<>(Arrays.asList(user2));

        when(libraryUserRepository.count()).thenReturn(1L);
        Specification<LibraryUser> mockSpecification = mock(Specification.class);
        when(libraryUserSpecifications.findAllByRoleAndColumnContaining(any(List.class), any(String.class), any(String.class))).thenReturn(mockSpecification);
        when(libraryUserRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class))).thenReturn(userPage);

        LibraryUserResponse response = libraryUserService.getUsers(selectedRoles, page, order, sortedColumn, searchColumn, searchValue);

        assertEquals(1L, response.getTotalLibraryUsers());
        assertEquals(1, response.getSingleLibraryUserResponse().size());
        assertEquals("user2", response.getSingleLibraryUserResponse().get(0).getUsername());
    }

    @Test
    void testGetRoles() {
        RoleEnum[] expectedRoles = RoleEnum.values();
        RoleEnum[] actualRoles = libraryUserService.getRoles();

        assertEquals(expectedRoles.length, actualRoles.length);
        for (int i = 0; i < expectedRoles.length; i++) {
            assertEquals(expectedRoles[i], actualRoles[i]);
        }
    }

    @Test
    void testChangePassword() {
        // Arrange
        String username = "testuser";
        String currentPassword = "currentPassword";
        String newPassword = "newPassword";
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest(username, currentPassword, newPassword);
        String encodedPassword = "encodedNewPassword";

        LibraryUser existingUser = new LibraryUser(username, "oldPassword", Collections.emptyList(), null, null);
        when(libraryUserRepository.findByUsername(username)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);
        when(libraryUserRepository.save(any(LibraryUser.class))).thenReturn(existingUser);

        // Act
        libraryUserService.changePassword(changePasswordRequest);

        // Assert
        Mockito.verify(libraryUserRepository).findByUsername(username);
        Mockito.verify(passwordEncoder).encode(newPassword);
        Mockito.verify(libraryUserRepository).save(existingUser);
        assertEquals(encodedPassword, existingUser.getPassword());
    }

    @Test
    void testAddUser() {
        // Arrange
        String username = "newUser";
        String password = "newPassword";
        List<RoleEnum> roles = List.of(RoleEnum.CUSTOMER);
        AddLibraryUserRequest addLibraryUserRequest = new AddLibraryUserRequest(0, username, password, roles, null, null, null, null);
        String encodedPassword = "encodedNewPassword";

        when(passwordEncoder.encode(addLibraryUserRequest.getPassword())).thenReturn(encodedPassword);
        when(libraryUserRepository.save(any(LibraryUser.class))).thenReturn(new LibraryUser());

        // Act
        libraryUserService.addUser(addLibraryUserRequest);

        // Assert
        Mockito.verify(passwordEncoder).encode(addLibraryUserRequest.getPassword());
        Mockito.verify(libraryUserRepository).save(any(LibraryUser.class));
    }

    @Test
    void testEditUser() {
        // Arrange
        Long userId = 1L;
        EditLibraryUserRequest editLibraryUserRequest = new EditLibraryUserRequest(userId, "editedUser", "editedPassword", List.of(RoleEnum.ADMIN));
        String encodedPassword = "encodedEditedPassword";

        LibraryUser existingUser = new LibraryUser("user", "oldPassword", List.of(new Role(RoleEnum.CUSTOMER)), null, null);
        when(libraryUserRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode(editLibraryUserRequest.getPassword())).thenReturn(encodedPassword);
        when(libraryUserRepository.save(any(LibraryUser.class))).thenReturn(existingUser);

        // Act
        libraryUserService.editUser(editLibraryUserRequest);

        // Assert
        Mockito.verify(libraryUserRepository).findById(userId);
        Mockito.verify(passwordEncoder).encode(editLibraryUserRequest.getPassword());
        Mockito.verify(libraryUserRepository).save(existingUser);
        assertEquals(editLibraryUserRequest.getUsername(), existingUser.getUsername());
        assertEquals(encodedPassword, existingUser.getPassword());
        assertEquals(RoleEnum.ADMIN, existingUser.getRoles().get(0).getRole());
    }

    @Test
    void testDeleteUser() {
        // Arrange
        Long userId = 1L;
        DeleteLibraryUserRequest deleteLibraryUserRequest = new DeleteLibraryUserRequest(userId);
        doNothing().when(libraryUserRepository).deleteById(deleteLibraryUserRequest.getId());

        // Act
        libraryUserService.deleteUser(deleteLibraryUserRequest);

        // Assert
        Mockito.verify(libraryUserRepository).deleteById(deleteLibraryUserRequest.getId());
    }
}
