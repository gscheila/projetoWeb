package com.example.demo.model

import jakarta.persistence.*

@Entity
@Table(name = "clientes")
data class Cliente(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var nome: String,
    
    @Column(nullable = false, unique = true)
    var email: String,
    
    @Column(nullable = false)
    var telefone: String,
    
    @Column(nullable = false)
    var estado: String
) 