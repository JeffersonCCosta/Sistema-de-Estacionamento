
package com.estacionamento.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Veiculo")
public class Veiculo {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String placa;

    private String modelo;
    private String cor;
    private LocalDateTime entrada;
    private LocalDateTime saida;

    public Veiculo() {}

    public Veiculo(String placa, String modelo, String cor, LocalDateTime entrada, LocalDateTime saida) {
        this.placa = placa;
        this.modelo = modelo;
        this.cor = cor;
        this.entrada = entrada;
        this.saida = saida;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDateTime getEntrada() {
        return entrada;
    }

    public void setEntrada(LocalDateTime entrada) {
        this.entrada = entrada;
    }

    public LocalDateTime getSaida() {
        return saida;
    }

    public void setSaida(LocalDateTime saida) {
        this.saida = saida;
    }
}
