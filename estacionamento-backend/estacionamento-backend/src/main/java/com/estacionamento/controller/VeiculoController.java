
package com.estacionamento.controller;

import com.estacionamento.dto.VeiculoEntradaDTO;
import com.estacionamento.dto.VeiculoSaidaDTO;
import com.estacionamento.model.Veiculo;
import com.estacionamento.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.PublicKey;
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
        if(veiculoRepository.findByPlaca(veiculo.getPlaca()).isPresent()){
            return ResponseEntity.status(500).body("Placa já cadastrada no sistema.");
        }
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
                    veiculo.setEntrada(entradaDTO.getEntrada());
                    veiculoRepository.save(veiculo);
                    return ResponseEntity.ok("Entrada registrado com sucesso.");
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body("Veículo com placa" + entradaDTO.getPlaca() + " não encontrado."));

    }

    @GetMapping("/sem-entrada")
    public List<Veiculo> listarSemEntrada() {
        return veiculoRepository.findByEntradaIsNull();
    }

    @PostMapping("/entrada/{placa}")
    public ResponseEntity<?> registrarEntradaPorPlaca(@PathVariable String placa, @RequestBody VeiculoEntradaDTO entradaDTO) {
        return veiculoRepository.findByPlaca(placa)
                .map(veiculo ->  {
                    veiculo.setEntrada(LocalDateTime.now());
                    veiculoRepository.save(veiculo);
                    return ResponseEntity.ok("Entrada registrado com sucesso.");
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body("Veículo com placa " + placa + " não encontrado."));
    }

    @GetMapping("/sem-saida")
    public List<Veiculo> listarSemSaida() {
        return veiculoRepository.findBySaidaIsNull();
    }

    @PostMapping("/saida")
    public ResponseEntity<?> registrarSaida(@RequestBody VeiculoSaidaDTO  saidaDTO) {
        return veiculoRepository.findByPlaca(saidaDTO.getPlaca())
                .map(veiculo -> {
                    if (veiculo.getEntrada() == null) {
                        return ResponseEntity.status(400)
                                .body("Não é possível registrar saída: veículo não possui entrada registrada.");
                    }
                    if (veiculo.getSaida() != null) {
                        return ResponseEntity.status(400)
                                .body("Saída já registrada para este veículo.");
                    }
                    veiculo.setSaida(saidaDTO.getSaida());
                    veiculoRepository.save(veiculo);
                    return ResponseEntity.ok("Saída registrada com sucesso.");
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body("Veículo com placa " + saidaDTO.getPlaca() + " não encontrado."));
    }

}
