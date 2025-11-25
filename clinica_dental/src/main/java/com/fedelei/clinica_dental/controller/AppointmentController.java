package com.fedelei.clinica_dental.controller;

import com.fedelei.clinica_dental.dto.AppointmentDTO;
import com.fedelei.clinica_dental.entity.Appointment;
import com.fedelei.clinica_dental.exception.ResourceNotFoundException;
import com.fedelei.clinica_dental.services.IAppointmentService;
import com.fedelei.clinica_dental.services.IDentistService;
import com.fedelei.clinica_dental.services.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/turnos")
public class AppointmentController {

    private IAppointmentService appointmentService;

    private IDentistService dentistService;

    private IPatientService patientService;

    @Autowired
    public AppointmentController(IAppointmentService appointmentService, IDentistService dentistService, IPatientService patientService) {
        this.appointmentService = appointmentService;
        this.dentistService = dentistService;
        this.patientService = patientService;
    }

    //este endpoint consulta todos los turnos
    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> findAll() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> save(@RequestBody AppointmentDTO appointmentDTO) {
        ResponseEntity<AppointmentDTO> response;

        //chequeamos que existan el odontólogo y el paciente
        if (dentistService.findById(appointmentDTO.getDentist_id()).isPresent()
                && patientService.findById(appointmentDTO.getPatient_id()).isPresent()) {
            //seteamos al ResponseEntity con el código 200 y le agregamos el turno como cuerpo de la respuesta
            response = ResponseEntity.ok(appointmentService.save(appointmentDTO));

        } else {
            //setear al ResponseEntity el código 400
            response = ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> findById(@PathVariable Long id) throws ResourceNotFoundException {
        Optional<AppointmentDTO> appointmentToLookFor = appointmentService.findById(id);

        if(appointmentToLookFor.isPresent()) {
            return ResponseEntity.ok(appointmentToLookFor.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<AppointmentDTO> update(@RequestBody AppointmentDTO appointmentDTO) throws Exception {
        ResponseEntity<AppointmentDTO> response;

        //chequeamos que existan el odontólogo y el paciente
        if (dentistService.findById(appointmentDTO.getDentist_id()).isPresent()
                && patientService.findById(appointmentDTO.getPatient_id()).isPresent()) {
            //ambos existen en la DB
            //seteamos al ResponseEntity con el código 200 y le agregamos el turno dto como cuerpo de la respuesta
            response = ResponseEntity.ok(appointmentService.update(appointmentDTO));

        } else {
            //uno no existe, entonces bloqueamos la operación
            //setear al ResponseEntity el código 400
            response = ResponseEntity.badRequest().build();
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) throws ResourceNotFoundException {
        appointmentService.delete(id);
        return ResponseEntity.ok("Se eliminó el turno con id: " + id);
    }
    // verifica si un odontólogo tiene disponible un turno en una fecha/hora específica.
    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long dentistId,
            @RequestParam String dateTime) {
        boolean available = appointmentService.isTimeSlotAvailable(dentistId, dateTime);
        return ResponseEntity.ok(available);
    }

}
