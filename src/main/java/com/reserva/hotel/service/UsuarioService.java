package com.reserva.hotel.service;

import com.reserva.hotel.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public boolean login(String usuario, String password) {
        return usuarioRepository
                .findByUsuarioAndPassword(usuario, password)
                .isPresent();
    }
}