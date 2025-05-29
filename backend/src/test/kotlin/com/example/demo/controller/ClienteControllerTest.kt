package com.example.demo.controller

import com.example.demo.model.Cliente
import com.example.demo.repository.ClienteRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.BeforeEach
import org.mockito.Mockito.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import com.fasterxml.jackson.databind.ObjectMapper
import java.util.Optional

@WebMvcTest(ClienteController::class)
class ClienteControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockBean
    private lateinit var clienteRepository: ClienteRepository

    private lateinit var cliente: Cliente

    @BeforeEach
    fun setup() {
        cliente = Cliente(
            id = 1L,
            nome = "João Silva",
            email = "joao@email.com",
            telefone = "(11) 99999-9999",
            estado = "SP"
        )
    }

    @Test
    fun `deve criar um novo cliente`() {
        `when`(clienteRepository.save(any(Cliente::class.java))).thenReturn(cliente)

        mockMvc.perform(post("/api/clientes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(cliente)))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nome").value(cliente.nome))
            .andExpect(jsonPath("$.email").value(cliente.email))
    }

    @Test
    fun `deve retornar todos os clientes`() {
        val clienteList = listOf(cliente)
        `when`(clienteRepository.findAll()).thenReturn(clienteList)

        mockMvc.perform(get("/api/clientes"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].nome").value(cliente.nome))
            .andExpect(jsonPath("$[0].email").value(cliente.email))
    }

    @Test
    fun `deve retornar um cliente por ID`() {
        `when`(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente))

        mockMvc.perform(get("/api/clientes/1"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nome").value(cliente.nome))
            .andExpect(jsonPath("$.email").value(cliente.email))
    }

    @Test
    fun `deve retornar 404 quando cliente não encontrado`() {
        `when`(clienteRepository.findById(2L)).thenReturn(Optional.empty())

        mockMvc.perform(get("/api/clientes/2"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `deve atualizar um cliente`() {
        val clienteAtualizado = cliente.copy(nome = "João Silva Atualizado")
        `when`(clienteRepository.existsById(1L)).thenReturn(true)
        `when`(clienteRepository.save(any(Cliente::class.java))).thenReturn(clienteAtualizado)

        mockMvc.perform(put("/api/clientes/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(clienteAtualizado)))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nome").value(clienteAtualizado.nome))
    }

    @Test
    fun `deve deletar um cliente`() {
        `when`(clienteRepository.existsById(1L)).thenReturn(true)
        doNothing().`when`(clienteRepository).deleteById(1L)

        mockMvc.perform(delete("/api/clientes/1"))
            .andExpect(status().isNoContent)
    }
} 