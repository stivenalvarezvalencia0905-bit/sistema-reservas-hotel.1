package com.reserva.hotel.controller;

import com.reserva.hotel.model.Habitacion;
import com.reserva.hotel.service.DisponibilidadService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/disponibilidad")
@CrossOrigin
public class DisponibilidadRestController {

    private final DisponibilidadService disponibilidadService;

    public DisponibilidadRestController(DisponibilidadService disponibilidadService) {
        this.disponibilidadService = disponibilidadService;
    }

    @GetMapping("/avanzada")
    public List<Habitacion> buscar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Double precioMax
    ) {
        return disponibilidadService.buscarDisponibles(inicio, fin, tipo, precioMax);
    }
}