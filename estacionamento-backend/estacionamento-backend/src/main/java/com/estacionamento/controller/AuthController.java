package com.estacionamento.controller;

import com.estacionamento.model.Usuario;
import com.estacionamento.security.JwtUtil;
import com.estacionamento.service.UsuarioService;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Usuario usuarioAutenticado = usuarioService.authenticateAndGet(usuario.getEmail(), usuario.getSenha());

        if (usuarioAutenticado != null) {
            return ResponseEntity.ok(new LoginResponse(
                    usuarioAutenticado.getNome(),
                    usuarioAutenticado.getEmail(),
                    JwtUtil.gerarToken(usuarioAutenticado.getEmail())
            ));
        } else {
            return ResponseEntity.status(401).body("Usuário ou senha inválidos");
        }
    }

    public static class LoginResponse {
        private String nome;
        private String email;
        private String token;

        public LoginResponse(String nome, String email, String token) {
            this.nome = nome;
            this.email = email;
            this.token = token;
        }

        public String getNome() { return nome; }
        public String getEmail() { return email; }
        public String getToken() { return token; }
    }
}
