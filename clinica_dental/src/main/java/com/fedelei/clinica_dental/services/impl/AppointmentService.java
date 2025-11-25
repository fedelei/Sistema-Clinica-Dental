package com.fedelei.clinica_dental.services.impl;

import com.fedelei.clinica_dental.dto.AppointmentDTO;
import com.fedelei.clinica_dental.entity.Appointment;
import com.fedelei.clinica_dental.entity.Dentist;
import com.fedelei.clinica_dental.entity.Patient;
import com.fedelei.clinica_dental.exception.ResourceNotFoundException;
import com.fedelei.clinica_dental.repository.IAppointmentRepository;
import com.fedelei.clinica_dental.services.IAppointmentService;
import com.fedelei.clinica_dental.services.IPatientService;
import com.fedelei.clinica_dental.services.IDentistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService implements IAppointmentService {

    private IAppointmentRepository appointmentRepository;
    private IPatientService patientService;
    private IDentistService dentistService;

    @Autowired
    public AppointmentService(IAppointmentRepository appointmentRepository, IPatientService patientService, IDentistService dentistService) {
        this.appointmentRepository = appointmentRepository;
        this.patientService = patientService;
        this.dentistService = dentistService;
    }

    @Override
    public AppointmentDTO save(AppointmentDTO appointmentDTO) {
        //mapear nuestras entidades como DTO a mano
        //instanciar una entidad de turno
        Appointment appointmentEntity = new Appointment();

        //recuperar el paciente desde la BD usando su ID
        Optional<Patient> patientEntity = patientService.findById(appointmentDTO.getPatient_id());
        if (patientEntity.isPresent()) {
            appointmentEntity.setPatient(patientEntity.get());
        }

        //recuperar el odontólogo desde la BD usando su ID
        Optional<Dentist> dentistEntity = dentistService.findById(appointmentDTO.getDentist_id());
        if (dentistEntity.isPresent()) {
            appointmentEntity.setDentist(dentistEntity.get());
        }

        //convertir el string del turnoDto que es la fecha a LocalDateTime
        // formato ISO local date-time: yyyy-MM-dd'T'HH:mm o yyyy-MM-dd'T'HH:mm:ss
        DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                .appendPattern("yyyy-MM-dd'T'HH:mm")
                .optionalStart()
                .appendPattern(":ss")
                .optionalEnd()
                .toFormatter();
        LocalDateTime date = LocalDateTime.parse(appointmentDTO.getDate(), formatter);

        //setear la fecha y hora
        appointmentEntity.setDate(date);

        //persistir en la BD
        appointmentRepository.save(appointmentEntity);

        //vamos a trabajar con el DTO que debemos devolver
        //generar una instancia de turno DTO
        AppointmentDTO appointmentDTOToReturn = new AppointmentDTO();

        //le seteamos los datos de la entidad que persistimos
        appointmentDTOToReturn.setId(appointmentEntity.getId());
        appointmentDTOToReturn.setDate(appointmentEntity.getDate().toString());
        appointmentDTOToReturn.setDentist_id(appointmentEntity.getDentist().getId());
        appointmentDTOToReturn.setPatient_id(appointmentEntity.getPatient().getId());

        return appointmentDTOToReturn;
    }

    @Override
    public Optional<AppointmentDTO> findById(Long id) throws ResourceNotFoundException {
        //vamos a buscar la entidad por id a la BD
        Optional<Appointment> appointmentToLookFor = appointmentRepository.findById(id);

        //instanciamos el dto
        Optional<AppointmentDTO> appointmentDTO = null;

        if (appointmentToLookFor.isPresent()) {
            //recuperar la entidad que se encontró y guardarla en la variable appointmen
            Appointment appointment = appointmentToLookFor.get();

            //trabajar sobre la información que tenemos que devolver: dto
            //vamos a crear una intancia de turno dto para devolver
            AppointmentDTO appointmentDTOToReturn = new AppointmentDTO();
            appointmentDTOToReturn.setId(appointment.getId());
            appointmentDTOToReturn.setPatient_id(appointment.getPatient().getId());
            appointmentDTOToReturn.setDentist_id(appointment.getDentist().getId());
            appointmentDTOToReturn.setDate(appointment.getDate().toString());

            appointmentDTO = Optional.of(appointmentDTOToReturn);
            return appointmentDTO;

        } else {
            throw new ResourceNotFoundException("No se encontró el turno con id: " + id);
        }




    }

    @Override
    public AppointmentDTO update(AppointmentDTO appointmentDTO) throws Exception {

        //chequeo que el turno a actualizar exista
        if(appointmentRepository.findById(appointmentDTO.getId()).isPresent()) {

            //buscar la entidad en la BD
            Optional<Appointment> appointmentEntity = appointmentRepository.findById(appointmentDTO.getId());

            //recuperar el paciente desde la BD usando su ID
            Optional<Patient> patientEntity = patientService.findById(appointmentDTO.getPatient_id());
            if (patientEntity.isPresent()) {
                appointmentEntity.get().setPatient(patientEntity.get());
            }

            //recuperar el odontólogo desde la BD usando su ID
            Optional<Dentist> dentistEntity = dentistService.findById(appointmentDTO.getDentist_id());
            if (dentistEntity.isPresent()) {
                appointmentEntity.get().setDentist(dentistEntity.get());
            }

            //convertir el string del turnoDto que es la fecha a LocalDateTime
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime date = LocalDateTime.parse(appointmentDTO.getDate(), formatter);

            //setear la fecha y hora
            appointmentEntity.get().setDate(date);

            //persistir en la BD
            appointmentRepository.save(appointmentEntity.get());

            //vamos a trabajar sobre la respuesta (dto) a devolver
            AppointmentDTO appointmentDTOToReturn = new AppointmentDTO();
            appointmentDTOToReturn.setId(appointmentEntity.get().getId());
            appointmentDTOToReturn.setPatient_id(appointmentEntity.get().getPatient().getId());
            appointmentDTOToReturn.setDentist_id(appointmentEntity.get().getDentist().getId());
            appointmentDTOToReturn.setDate(appointmentEntity.get().getDate().toString());

            return appointmentDTOToReturn;
        } else {
            throw new Exception("No se pudo actualizar el turno");
        }

    }

    @Override
    public Optional<AppointmentDTO> delete(Long id) throws ResourceNotFoundException {
        //vamos a buscar la entidad por id en la BD y guardara en un Optional
        Optional<Appointment> appointmentToLookFor = appointmentRepository.findById(id);

        Optional<AppointmentDTO> appointmentDTO;
        if (appointmentToLookFor.isPresent()) {
            //recuperar el turno que se encontró y lo vamos a guardar en una variable turno
            Appointment appointment =  appointmentToLookFor.get();

            //vamos a devolver un dto
            //vamos a trabajar sobre ese dto a devolver
            //crear una instancia de ese dto
            AppointmentDTO appointmentDTOToReturn = new AppointmentDTO();
            appointmentDTOToReturn.setId(appointment.getId());
            appointmentDTOToReturn.setDentist_id(appointment.getDentist().getId());
            appointmentDTOToReturn.setPatient_id(appointment.getPatient().getId());
            appointmentDTOToReturn.setDate(appointment.getDate().toString());

            // ELIMINAR el turno de la base de datos
            appointmentRepository.delete(appointment);

            appointmentDTO = Optional.of(appointmentDTOToReturn);
            return appointmentDTO;

        } else {
            //vamos a lanzar la exception
            throw new ResourceNotFoundException("No se encontró el turno con id: " + id);
        }

    }

    @Override
    public List<AppointmentDTO> findAll() {
        //vamos a traernos las entidades de la BD y la vamos a guardar en una lista
        List<Appointment> appointments = appointmentRepository.findAll();

        //vamos a crear una lista vacía de turnos DTO
        List<AppointmentDTO> appointmentDTOS = new ArrayList<>();

        //recorremos la lista de entidades de turno para luego
        //guardarlas en la lista de turnos DTO
        for (Appointment appointment: appointments) {
            appointmentDTOS.add(new AppointmentDTO(appointment.getId(),
                    appointment.getDentist().getId(), appointment.getPatient().getId(),
                    appointment.getDate().toString()));
        }

        return appointmentDTOS;
    }

    @Override
    public boolean isTimeSlotAvailable(Long dentistId, String dateTimeStr) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime requestedTime = LocalDateTime.parse(dateTimeStr, formatter);
            LocalDateTime requestedTimeEnd = requestedTime.plusMinutes(30);

            List<Appointment> allAppointments = appointmentRepository.findAll();

            for (Appointment appointment : allAppointments) {
                // Solo verificar turnos del mismo odontólogo
                if (!appointment.getDentist().getId().equals(dentistId)) {
                    continue;
                }

                LocalDateTime appointmentStart = appointment.getDate();
                LocalDateTime appointmentEnd = appointmentStart.plusMinutes(30);

                // Verificar si hay superposición
                if ((requestedTime.isBefore(appointmentEnd) && requestedTimeEnd.isAfter(appointmentStart))) {
                    return false; // Hay conflicto
                }
            }

            return true; // No hay conflicto, slot disponible
        } catch (Exception e) {
            return false;
        }
    }
}
