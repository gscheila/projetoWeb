package com.example.demo.model

import jakarta.persistence.*

@Entity
@Table(name = "funcionarios")
data class Funcionario(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var nome: String,
    
    @Column(nullable = false, unique = true)
    var email: String,
    
    @Column(nullable = false)
    var time: String,
    
    @Column(nullable = false)
    var mesEntrada: String,
    
    @Column(nullable = false)
    var fabrica: String,
    
    @Column(nullable = false)
    var senioridade: String,
    
    @Column(nullable = false)
    var cargo: String,
    
    @Column(nullable = false)
    var modelo: String
) 