package com.reserva.hotel.dto;

import java.time.LocalDate;

public class ReservaDTO {

    private Long clienteId;
    private Long habitacionId;
    private LocalDate fechaIngreso;
    private LocalDate fechaSalida;

    // ===== GETTERS =====
    public Long getClienteId() {
        return clienteId;
    }

    public Long getHabitacionId() {
        return habitacionId;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public LocalDate getFechaSalida() {
        return fechaSalida;
    }

    // ===== SETTERS =====
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public void setHabitacionId(Long habitacionId) {
        this.habitacionId = habitacionId;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public void setFechaSalida(LocalDate fechaSalida) {
        this.fechaSalida = fechaSalida;
    }
}