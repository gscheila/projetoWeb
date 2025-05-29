package com.example.demo.controller

import com.example.demo.model.Cliente
import com.example.demo.repository.ClienteRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = ["http://localhost:3000"])
class ClienteController(private val clienteRepository: ClienteRepository) {

    @GetMapping
    fun getAllClientes(): List<Cliente> = clienteRepository.findAll()

    @PostMapping
    fun createCliente(@RequestBody cliente: Cliente): Cliente = clienteRepository.save(cliente)

    @GetMapping("/{id}")
    fun getClienteById(@PathVariable id: Long): ResponseEntity<Cliente> =
        clienteRepository.findById(id)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())

    @PutMapping("/{id}")
    fun updateCliente(@PathVariable id: Long, @RequestBody cliente: Cliente): ResponseEntity<Cliente> {
        return if (clienteRepository.existsById(id)) {
            ResponseEntity.ok(clienteRepository.save(cliente.copy(id = id)))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteCliente(@PathVariable id: Long): ResponseEntity<Void> {
        return if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 