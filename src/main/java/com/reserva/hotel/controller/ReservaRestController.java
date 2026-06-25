package com.reserva.hotel.controller;

import com.reserva.hotel.dto.ReservaDTO;
import com.reserva.hotel.model.Reserva;
import com.reserva.hotel.service.ReservaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaRestController {

    private final ReservaService reservaService;

    public ReservaRestController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    // ✅ CREAR RESERVA
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ReservaDTO dto) {

    reservaService.crearReserva(
            dto.getClienteId(),
            dto.getHabitacionId(),
            dto.getFechaIngreso(),
            dto.getFechaSalida()
    );

    return ResponseEntity.ok("Reserva creada correctamente");

    }

    // 📋 LISTAR TODAS
    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaService.listarReservas();
    }

    // 📊 RESERVAS POR CLIENTE
    @GetMapping("/cliente/{email}")
    public List<Reserva> reservasPorCliente(@PathVariable String email) {
        return reservaService.reservasPorCliente(email);
    }

    // 📆 CALENDARIO MENSUAL (NUEVO – SIN CONFLICTO)
    @GetMapping("/calendario-mensual")
    public List<Reserva> calendarioMes(
            @RequestParam int mes,
            @RequestParam int anio
    ) {
        LocalDate inicio = LocalDate.of(anio, mes, 1);
        LocalDate fin = inicio.withDayOfMonth(inicio.lengthOfMonth());
        return reservaService.reservasEntreFechas(inicio, fin);
    }

    // 📅 ENTRE FECHAS (BUSCADOR AVANZADO)
    @GetMapping("/entre-fechas")
    public List<Reserva> reservasEntreFechas(
            @RequestParam
            @org.springframework.format.annotation.DateTimeFormat(
                    iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
            LocalDate inicio,

            @RequestParam
            @org.springframework.format.annotation.DateTimeFormat(
                    iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
            LocalDate fin
    ) {
        return reservaService.reservasEntreFechas(inicio, fin);
    }

    // ❌ ELIMINAR
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
    }
}