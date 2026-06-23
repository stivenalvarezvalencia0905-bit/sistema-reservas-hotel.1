package com.reserva.hotel.service;

import com.reserva.hotel.model.Habitacion;
import com.reserva.hotel.repository.HabitacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitacionService {

    private final HabitacionRepository repository;

    public HabitacionService(HabitacionRepository repository) {
        this.repository = repository;
    }

    // LISTAR
    public List<Habitacion> listar() {
        return repository.findAll();
    }

    // GUARDAR
    public Habitacion guardar(Habitacion habitacion) {
        if (habitacion.getEstado() == null) {
            habitacion.setEstado("DISPONIBLE");
        }
        return repository.save(habitacion);
    }

    // ELIMINAR
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // CAMBIAR ESTADO
    public Habitacion cambiarEstado(Long id, String nuevoEstado) {
        Habitacion habitacion = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));

        habitacion.setEstado(nuevoEstado);
        return repository.save(habitacion);
    }
}