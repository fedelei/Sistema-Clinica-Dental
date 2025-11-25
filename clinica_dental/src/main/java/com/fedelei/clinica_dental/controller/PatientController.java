package com.fedelei.clinica_dental.controller;

import com.fedelei.clinica_dental.entity.Patient;
import com.fedelei.clinica_dental.exception.ResourceNotFoundException;
import com.fedelei.clinica_dental.services.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
public class PatientController {

    private IPatientService patientService;

    @Autowired
    public PatientController(IPatientService patientService) {
        this.patientService = patientService;
    }

    //un endpoint que nos permita agregar un paciente
    @PostMapping
    public ResponseEntity<?> save(@RequestBody Patient patient) {
        // Validar que el documento (cardIdentity) no esté duplicado
        if (patient.getCardIdentity() != null && patientService.existsByCardIdentity(patient.getCardIdentity())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    "Ya existe un paciente registrado con este documento: " + patient.getCardIdentity());
        }
        Patient savedPatient = patientService.save(patient);
        return ResponseEntity.ok(savedPatient);
    }

    //un endpoint que nos permita actualizar un paciente que ya esté registrado
    @PutMapping
    public void update(@RequestBody Patient patient) {
        patientService.update(patient);
    }

    @GetMapping
    public List<Patient> findAll() {
        return patientService.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) throws ResourceNotFoundException {
        patientService.delete(id);
        return ResponseEntity.ok("Se eliminó el paciente con id: " + id);
    }

}
