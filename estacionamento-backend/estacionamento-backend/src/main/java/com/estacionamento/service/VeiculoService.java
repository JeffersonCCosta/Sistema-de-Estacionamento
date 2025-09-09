package com.estacionamento.service;

import com.estacionamento.model.Veiculo;
import com.estacionamento.repository.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VeiculoService {
    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public List<Veiculo> listarSemEntrada() {
        return veiculoRepository.findByEntradaIsNull();
    }

    public Optional<Veiculo> registrarEntrada(String placa) {
        Optional<Veiculo> veiculoOptional = veiculoRepository.findByPlaca(placa);
        if (veiculoOptional.isPresent()) {
            Veiculo veiculo = veiculoOptional.get();
            veiculo.setEntrada(LocalDateTime.now());
            veiculoRepository.save(veiculo);
        }
        return veiculoOptional;
    }



}
