package com.reserva.hotel.controller;

import com.reserva.hotel.dto.LoginRequest;
import com.reserva.hotel.dto.LoginResponse;
import com.reserva.hotel.model.Cliente;
import com.reserva.hotel.service.ClienteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteRestController {

    private final ClienteService clienteService;

    public ClienteRestController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /* =========================
       📋 LISTAR CLIENTES
    ========================= */
    @GetMapping
    public List<Cliente> listar() {
        return clienteService.listar();
    }

    /* =========================
       📝 REGISTRAR CLIENTE
    ========================= */
    @PostMapping("/registro")
    public Cliente registrar(@RequestBody Cliente cliente) {
        return clienteService.registrar(cliente);
    }

    /* =========================
       🔍 BUSCAR CLIENTE POR ID
    ========================= */
    @GetMapping("/{id}")
    public Cliente obtenerPorId(@PathVariable Long id) {
        return clienteService.buscarPorId(id);
    }

    /* =========================
       🔐 LOGIN
    ========================= */
    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {

    Cliente cliente = clienteService.login(
            request.getEmail(),
            request.getPassword()
    );

    return new LoginResponse(
            cliente.getId(),
            cliente.getEmail(),
            cliente.getRol(),
            cliente.getNombre()
    );
}

    /* =========================
       ❌ ELIMINAR CLIENTE
    ========================= */
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
    }
}