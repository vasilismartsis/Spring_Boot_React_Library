//package com.library.Library_Back_End.security;
//
//import com.library.Library_Back_End.libraryUser.LibraryUser;
//import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Collection;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final LibraryUserRepository libraryUserRepository;
//
//    @Autowired
//    public CustomUserDetailsService(LibraryUserRepository libraryUserRepository) {
//        this.libraryUserRepository = libraryUserRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) {
//        return new UserDetails() {
//            @Override
//            public Collection<? extends GrantedAuthority> getAuthorities() {
//                return null;
//            }
//
//            @Override
//            public String getPassword() {
//                return null;
//            }
//
//            @Override
//            public String getUsername() {
//                return null;
//            }
//
//            @Override
//            public boolean isAccountNonExpired() {
//                return false;
//            }
//
//            @Override
//            public boolean isAccountNonLocked() {
//                return false;
//            }
//
//            @Override
//            public boolean isCredentialsNonExpired() {
//                return false;
//            }
//
//            @Override
//            public boolean isEnabled() {
//                return false;
//            }
//        };
//    }
//}
