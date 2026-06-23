package com.reserva.hotel.dto;

public class LoginResponse {

    private Long id;
    private String email;
    private String rol;
    private String nombre;

    public LoginResponse(Long id, String email, String rol, String nombre) {
        this.id = id;
        this.email = email;
        this.rol = rol;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRol() {
        return rol;
    }

    public String getNombre() {
        return nombre;
    }
}
