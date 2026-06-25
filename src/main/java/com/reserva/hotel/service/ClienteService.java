package com.reserva.hotel.service;

import com.reserva.hotel.model.Cliente;
import com.reserva.hotel.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // REGISTRAR CLIENTE
    public Cliente registrar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // LISTAR CLIENTES
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    // BUSCAR POR ID
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    // BUSCAR POR EMAIL
    public Cliente buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // LOGIN
    public Cliente login(String email, String password) {

        if (email == null || password == null) {
            throw new RuntimeException("Email o password vacío");
        }

        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no existe"));

        if (!cliente.getPassword().equals(password)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return cliente;
    }

    // ELIMINAR
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}