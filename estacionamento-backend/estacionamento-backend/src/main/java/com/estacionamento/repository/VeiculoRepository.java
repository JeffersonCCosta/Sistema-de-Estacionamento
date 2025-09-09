package com.estacionamento.repository;

import com.estacionamento.model.Usuario;
import com.estacionamento.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VeiculoRepository extends JpaRepository<Veiculo, Integer> {
    Optional<Veiculo> findByPlaca(String placa);

    List<Veiculo> findByEntradaIsNull();

    List<Veiculo> findBySaidaIsNull();

}
