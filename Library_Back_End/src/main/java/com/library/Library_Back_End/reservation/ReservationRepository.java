package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import jakarta.persistence.Id;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Page<Reservation> findAll(Specification<Reservation> reservationSpecification, Pageable pageable);

    Page<Reservation> findAllByLibraryUser(LibraryUser libraryUser, Pageable pageable);
}