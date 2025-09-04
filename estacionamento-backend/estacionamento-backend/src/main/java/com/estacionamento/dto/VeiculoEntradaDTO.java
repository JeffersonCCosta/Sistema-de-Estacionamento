package com.estacionamento.dto;

import java.time.LocalDateTime;

public class VeiculoEntradaDTO {
    private String placa;
    private LocalDateTime entrada;

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public LocalDateTime getEntrada() {
        return entrada;
    }

    public void setEntrada(LocalDateTime entrada) {
        this.entrada = entrada;
    }
}
