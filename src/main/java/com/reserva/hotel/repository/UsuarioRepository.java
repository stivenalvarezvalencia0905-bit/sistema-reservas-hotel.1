package com.reserva.hotel.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.reserva.hotel.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuarioAndPassword(String usuario, String password);
}
