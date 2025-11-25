package com.fedelei.clinica_dental.services;

import com.fedelei.clinica_dental.entity.Dentist;
import com.fedelei.clinica_dental.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

public interface IDentistService {
    Dentist save (Dentist dentist);
    Optional<Dentist> findById(Long id);
    void update(Dentist dentist);
    void delete(Long id) throws ResourceNotFoundException;
    List<Dentist> findAll();
    Optional<Dentist> findByRegistration(Integer registration);
}
