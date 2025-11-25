package com.fedelei.clinica_dental.repository;

import com.fedelei.clinica_dental.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    // Use findFirstByEmail to avoid NonUniqueResultException if DB contains duplicates
    Optional<User> findFirstByEmail(String email);
}
