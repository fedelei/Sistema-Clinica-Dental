package com.fedelei.clinica_dental.repository;

import com.fedelei.clinica_dental.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Long> {
}
