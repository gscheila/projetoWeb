package com.example.demo.repository

import com.example.demo.model.Cliente
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.assertj.core.api.Assertions.assertThat

@DataJpaTest
class ClienteRepositoryTest {

    @Autowired
    private lateinit var entityManager: TestEntityManager

    @Autowired
    private lateinit var clienteRepository: ClienteRepository

    private lateinit var cliente: Cliente

    @BeforeEach
    fun setup() {
        cliente = Cliente(
            nome = "Maria Silva",
            email = "maria@email.com",
            telefone = "(11) 98888-8888",
            estado = "RJ"
        )
    }

    @Test
    fun `deve salvar um cliente`() {
        val clienteSalvo = clienteRepository.save(cliente)
        
        assertThat(clienteSalvo.id).isNotNull()
        assertThat(clienteSalvo.nome).isEqualTo(cliente.nome)
        assertThat(clienteSalvo.email).isEqualTo(cliente.email)
    }

    @Test
    fun `deve encontrar cliente por ID`() {
        val clientePersistido = entityManager.persist(cliente)
        entityManager.flush()

        val clienteEncontrado = clienteRepository.findById(clientePersistido.id).orElse(null)

        assertThat(clienteEncontrado).isNotNull
        assertThat(clienteEncontrado.nome).isEqualTo(cliente.nome)
        assertThat(clienteEncontrado.email).isEqualTo(cliente.email)
    }

    @Test
    fun `deve retornar null quando buscar cliente inexistente`() {
        val clienteEncontrado = clienteRepository.findById(999L).orElse(null)
        assertThat(clienteEncontrado).isNull()
    }

    @Test
    fun `deve atualizar um cliente`() {
        val clientePersistido = entityManager.persist(cliente)
        entityManager.flush()

        clientePersistido.nome = "Maria Silva Atualizado"
        val clienteAtualizado = clienteRepository.save(clientePersistido)

        assertThat(clienteAtualizado.nome).isEqualTo("Maria Silva Atualizado")
    }

    @Test
    fun `deve deletar um cliente`() {
        val clientePersistido = entityManager.persist(cliente)
        entityManager.flush()

        clienteRepository.deleteById(clientePersistido.id)

        val clienteDeletado = clienteRepository.findById(clientePersistido.id).orElse(null)
        assertThat(clienteDeletado).isNull()
    }
} 