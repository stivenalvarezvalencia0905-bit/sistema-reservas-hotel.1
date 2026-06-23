package com.reserva.hotel.repository;

import com.reserva.hotel.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // 🔎 Reservas por email del cliente
    List<Reserva> findByClienteEmail(String email);

    // 📅 Reservas entre fechas (calendario)
    List<Reserva> findByFechaIngresoLessThanEqualAndFechaSalidaGreaterThanEqual(
            LocalDate fin, LocalDate inicio
    );
}