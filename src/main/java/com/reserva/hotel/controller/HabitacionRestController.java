package com.reserva.hotel.controller;

import com.reserva.hotel.model.Habitacion;
import com.reserva.hotel.service.HabitacionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionRestController {

    private final HabitacionService service;

    public HabitacionRestController(HabitacionService service) {
        this.service = service;
    }

    // LISTAR
    @GetMapping
    public List<Habitacion> listar() {
        return service.listar();
    }

    // GUARDAR
    @PostMapping
    public Habitacion guardar(@RequestBody Habitacion habitacion) {
        return service.guardar(habitacion);
    }

    // CAMBIAR ESTADO
    @PutMapping("/{id}/estado")
    public Habitacion cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {

        return service.cambiarEstado(id, estado);
    }
}

