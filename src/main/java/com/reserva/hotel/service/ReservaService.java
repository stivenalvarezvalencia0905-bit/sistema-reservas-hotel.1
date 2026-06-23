package com.reserva.hotel.service;

import com.reserva.hotel.model.Reserva;
import com.reserva.hotel.model.Cliente;
import com.reserva.hotel.model.Habitacion;
import com.reserva.hotel.repository.ReservaRepository;
import com.reserva.hotel.repository.ClienteRepository;
import com.reserva.hotel.repository.HabitacionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final ClienteRepository clienteRepository;
    private final HabitacionRepository habitacionRepository;

    public ReservaService(
            ReservaRepository reservaRepository,
            ClienteRepository clienteRepository,
            HabitacionRepository habitacionRepository
    ) {
        this.reservaRepository = reservaRepository;
        this.clienteRepository = clienteRepository;
        this.habitacionRepository = habitacionRepository;
    }

    // ✅ CREAR RESERVA (ESTABLE)
    public Reserva crearReserva(
            Long clienteId,
            Long habitacionId,
            LocalDate ingreso,
            LocalDate salida
    ) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no existe"));

        Habitacion habitacion = habitacionRepository.findById(habitacionId)
                .orElseThrow(() -> new RuntimeException("Habitación no existe"));

        Reserva reserva = new Reserva();
        reserva.setCliente(cliente);
        reserva.setHabitacion(habitacion);
        reserva.setFechaIngreso(ingreso);
        reserva.setFechaSalida(salida);
        reserva.setEstado("ACTIVA");

        habitacion.setEstado("OCUPADA");
        habitacionRepository.save(habitacion);

 reservaRepository.save(reserva);

System.out.println("📧 Email enviado al cliente: Reserva CONFIRMADA");
return reserva;

      
    }

    // 📋 LISTAR TODAS
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    // ❌ ELIMINAR
    public void eliminarReserva(Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado("DISPONIBLE");
        habitacionRepository.save(habitacion);

        reservaRepository.delete(reserva);
        reservaRepository.delete(reserva);

System.out.println("📧 Email enviado al cliente: Reserva CANCELADA");

    }

    // 📊 RESERVAS POR CLIENTE
    public List<Reserva> reservasPorCliente(String email) {
        return reservaRepository.findByClienteEmail(email);
    }

    // 📅 ENTRE FECHAS
    public List<Reserva> reservasEntreFechas(LocalDate inicio, LocalDate fin) {
        return reservaRepository
                .findByFechaIngresoLessThanEqualAndFechaSalidaGreaterThanEqual(fin, inicio);
    }
}