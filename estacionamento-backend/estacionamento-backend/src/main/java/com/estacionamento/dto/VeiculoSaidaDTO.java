package com.estacionamento.dto;

import java.time.LocalDateTime;

public class VeiculoSaidaDTO {
    private String placa;
    private LocalDateTime saida;

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public LocalDateTime getSaida() {
        return saida;
    }

    public void setSaida(LocalDateTime saida) {
        this.saida = saida;
    }
}
