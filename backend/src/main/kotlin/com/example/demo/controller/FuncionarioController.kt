package com.example.demo.controller

import com.example.demo.model.Funcionario
import com.example.demo.repository.FuncionarioRepository
import com.example.demo.service.FuncionarioImportService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = ["http://localhost:3000"])
class FuncionarioController(
    private val repository: FuncionarioRepository,
    private val importService: FuncionarioImportService
) {

    @GetMapping
    fun listarTodos(): List<Funcionario> = repository.findAll()

    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Funcionario> {
        val funcionario = repository.findById(id)
        return if (funcionario.isPresent) {
            ResponseEntity.ok(funcionario.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun criar(@RequestBody funcionario: Funcionario): ResponseEntity<Funcionario> {
        val novoFuncionario = repository.save(funcionario)
        return ResponseEntity.status(HttpStatus.CREATED).body(novoFuncionario)
    }

    @PutMapping("/{id}")
    fun atualizar(@PathVariable id: Long, @RequestBody funcionario: Funcionario): ResponseEntity<Funcionario> {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }
        val funcionarioAtualizado = funcionario.copy(id = id)
        return ResponseEntity.ok(repository.save(funcionarioAtualizado))
    }

    @DeleteMapping("/{id}")
    fun deletar(@PathVariable id: Long): ResponseEntity<Void> {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }
        repository.deleteById(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/importar")
    fun importarPlanilha(@RequestParam("file") file: MultipartFile): ResponseEntity<List<Funcionario>> {
        return try {
            val funcionarios = importService.importFromFile(file)
            ResponseEntity.ok(funcionarios)
        } catch (e: Exception) {
            ResponseEntity.badRequest().build()
        }
    }
} 