package com.fedelei.clinica_dental.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AppointmentDTO {
    private Long id;
    
    @JsonProperty("dentist_id")
    private Long dentist_id;
    
    @JsonProperty("odontologoId")
    private Long odontologoId;
    
    @JsonProperty("patient_id")
    private Long patient_id;
    
    @JsonProperty("pacienteId")
    private Long pacienteId;
    
    // ISO date-time string, e.g. 2025-11-18T15:30
    @JsonProperty("date")
    private String date;
    
    @JsonProperty("fecha")
    private String fecha;

    public AppointmentDTO() {
    }

    public AppointmentDTO(Long id, Long dentist_id, Long patient_id, String date) {
        this.id = id;
        this.dentist_id = dentist_id;
        this.patient_id = patient_id;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDentist_id() {
        // Priorizar dentist_id, pero si es null, usar odontologoId
        return dentist_id != null ? dentist_id : odontologoId;
    }

    public void setDentist_id(Long dentist_id) {
        this.dentist_id = dentist_id;
    }
    
    public Long getOdontologoId() {
        return odontologoId != null ? odontologoId : dentist_id;
    }

    public void setOdontologoId(Long odontologoId) {
        this.odontologoId = odontologoId;
    }

    public Long getPatient_id() {
        // Priorizar patient_id, pero si es null, usar pacienteId
        return patient_id != null ? patient_id : pacienteId;
    }

    public void setPatient_id(Long patient_id) {
        this.patient_id = patient_id;
    }
    
    public Long getPacienteId() {
        return pacienteId != null ? pacienteId : patient_id;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public String getDate() {
        // Priorizar date, pero si es null, usar fecha
        return date != null ? date : fecha;
    }

    public void setDate(String date) {
        this.date = date;
    }
    
    public String getFecha() {
        return fecha != null ? fecha : date;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
}
