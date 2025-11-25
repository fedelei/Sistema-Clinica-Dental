package com.fedelei.clinica_dental.repository;

import com.fedelei.clinica_dental.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByCardIdentity(Integer cardIdentity);
}
