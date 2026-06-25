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
    private final EmailService emailService;

    public ReservaService(
            ReservaRepository reservaRepository,
            ClienteRepository clienteRepository,
            HabitacionRepository habitacionRepository,
            EmailService emailService
    ) {
        this.reservaRepository = reservaRepository;
        this.clienteRepository = clienteRepository;
        this.habitacionRepository = habitacionRepository;
        this.emailService = emailService;
    }

    // ✅ CREAR RESERVA
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

        // 📧 CORREO CONFIRMACIÓN (NO BLOQUEANTE)
        try {
    emailService.enviarCorreo(
            cliente.getEmail(),
            "Reserva confirmada",
            "Hola " + cliente.getNombre() +
                    "\n\nTu reserva fue confirmada exitosamente." +
                    "\nHabitación: " + habitacion.getNumero() +
                    "\nIngreso: " + ingreso +
                    "\nSalida: " + salida
    );
} catch (Exception e) {
    System.out.println("⚠️ Error enviando correo: " + e.getMessage());
}

return reserva;

    }

    // 📋 LISTAR TODAS
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    // ❌ CANCELAR RESERVA
    public void eliminarReserva(Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Habitacion habitacion = reserva.getHabitacion();
        habitacion.setEstado("DISPONIBLE");
        habitacionRepository.save(habitacion);
        

        reservaRepository.delete(reserva);

        // 📧 CORREO CANCELACIÓN (NO BLOQUEANTE)
        try {
        emailService.enviarCorreo(
                reserva.getCliente().getEmail(),
                "Reserva cancelada",
                "Tu reserva con ID " + reserva.getId() +
                        " ha sido cancelada.\n\nGracias por usar el sistema."
        );
    } catch (Exception e) {
        System.out.println("⚠️ Error enviando correo: " + e.getMessage());
    }
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