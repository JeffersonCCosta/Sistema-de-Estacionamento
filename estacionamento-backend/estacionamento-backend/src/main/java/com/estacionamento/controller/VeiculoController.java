
package com.estacionamento.controller;

import com.estacionamento.dto.VeiculoEntradaDTO;
import com.estacionamento.model.Veiculo;
import com.estacionamento.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    @Autowired
    private final VeiculoRepository  veiculoRepository;

    public VeiculoController(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    @PostMapping
    public ResponseEntity<String> cadastrar(@RequestBody Veiculo veiculo) {
        veiculoRepository.save(veiculo);
        return ResponseEntity.ok("Veículo cadastrado com sucesso.");
    }

    @GetMapping
    public List<Veiculo> listar() {
        return veiculoRepository.findAll();
    }

    @PostMapping("/entrada")
    public ResponseEntity<?> registrarEntrada(@RequestBody VeiculoEntradaDTO entradaDTO) {
        return veiculoRepository.findByPlaca(entradaDTO.getPlaca())
                .map(veiculo -> {
                    veiculo.setEntrada(LocalDateTime.now());
                    veiculoRepository.save(veiculo);
                    return ResponseEntity.ok("Entrada registrado com sucesso.");
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body("Veículo com placa" + entradaDTO.getPlaca() + " não encontrado."));

    }

}
