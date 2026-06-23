package com.reserva.hotel.service;

import com.reserva.hotel.model.Habitacion;
import com.reserva.hotel.model.Reserva;
import com.reserva.hotel.repository.HabitacionRepository;
import com.reserva.hotel.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DisponibilidadService {

    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;

    public DisponibilidadService(
            ReservaRepository reservaRepository,
            HabitacionRepository habitacionRepository
    ) {
        this.reservaRepository = reservaRepository;
        this.habitacionRepository = habitacionRepository;
    }

    public List<Habitacion> buscarDisponibles(
            LocalDate inicio,
            LocalDate fin,
            String tipo,
            Double precioMax
    ) {

        List<Reserva> reservas = reservaRepository
                .findByFechaIngresoLessThanEqualAndFechaSalidaGreaterThanEqual(fin, inicio);

        List<Long> ocupadas = new ArrayList<>();
        for (Reserva r : reservas) {
            ocupadas.add(r.getHabitacion().getId());
        }

        List<Habitacion> disponibles = new ArrayList<>();

        for (Habitacion h : habitacionRepository.findAll()) {

            if (ocupadas.contains(h.getId())) continue;
            if (tipo != null && !tipo.isEmpty() && !h.getTipo().equalsIgnoreCase(tipo)) continue;
            if (precioMax != null && h.getPrecio() > precioMax) continue;

            disponibles.add(h);
        }

        return disponibles;
    }
}