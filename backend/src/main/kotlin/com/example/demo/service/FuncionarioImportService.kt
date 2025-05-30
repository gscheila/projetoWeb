package com.example.demo.service

import com.example.demo.model.Funcionario
import com.example.demo.repository.FuncionarioRepository
import org.apache.poi.ss.usermodel.*
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.BufferedReader
import java.io.InputStreamReader
import org.slf4j.LoggerFactory

@Service
class FuncionarioImportService(private val repository: FuncionarioRepository) {
    private val logger = LoggerFactory.getLogger(FuncionarioImportService::class.java)

    fun importFromFile(file: MultipartFile): List<Funcionario> {
        return try {
            when {
                isCsvFile(file.originalFilename) -> importFromCsv(file)
                isExcelFile(file.originalFilename) -> importFromExcel(file)
                else -> throw IllegalArgumentException("Formato de arquivo não suportado. Use .csv, .xls ou .xlsx")
            }
        } catch (e: Exception) {
            logger.error("Erro ao importar arquivo: ${e.message}", e)
            throw RuntimeException("Erro ao importar arquivo. Verifique o formato e tente novamente. Detalhes: ${e.message}")
        }
    }

    private fun importFromCsv(file: MultipartFile): List<Funcionario> {
        val funcionarios = mutableListOf<Funcionario>()
        try {
            BufferedReader(InputStreamReader(file.inputStream)).use { reader ->
                var line = reader.readLine() // Skip header
                line = reader.readLine()
                
                while (line != null) {
                    val fields = line.split(",")
                    if (fields.size >= 8) {
                        try {
                            val funcionario = createFuncionario(fields)
                            funcionarios.add(funcionario)
                        } catch (e: Exception) {
                            logger.warn("Erro ao processar linha do CSV: $line", e)
                        }
                    }
                    line = reader.readLine()
                }
            }
        } catch (e: Exception) {
            logger.error("Erro ao ler arquivo CSV", e)
            throw RuntimeException("Erro ao ler arquivo CSV. Verifique o formato e tente novamente.")
        }

        return if (funcionarios.isEmpty()) {
            throw RuntimeException("Nenhum funcionário válido encontrado no arquivo CSV.")
        } else {
            repository.saveAll(funcionarios)
        }
    }

    private fun importFromExcel(file: MultipartFile): List<Funcionario> {
        val funcionarios = mutableListOf<Funcionario>()
        
        try {
            WorkbookFactory.create(file.inputStream).use { workbook ->
                val sheet = workbook.getSheetAt(0)
                val rows = sheet.iterator()
                
                if (!rows.hasNext()) {
                    throw RuntimeException("Planilha vazia.")
                }
                
                rows.next() // Skip header row
                
                while (rows.hasNext()) {
                    val row = rows.next()
                    try {
                        val fields = extractFieldsFromRow(row)
                        if (fields.any { it.isNotBlank() }) {
                            val funcionario = createFuncionario(fields)
                            funcionarios.add(funcionario)
                        }
                    } catch (e: Exception) {
                        logger.warn("Erro ao processar linha ${row.rowNum + 1} da planilha", e)
                    }
                }
            }
        } catch (e: Exception) {
            logger.error("Erro ao ler arquivo Excel", e)
            throw RuntimeException("Erro ao ler arquivo Excel. Verifique o formato e tente novamente.")
        }

        return if (funcionarios.isEmpty()) {
            throw RuntimeException("Nenhum funcionário válido encontrado na planilha.")
        } else {
            repository.saveAll(funcionarios)
        }
    }

    private fun extractFieldsFromRow(row: Row): List<String> {
        return List(8) { index ->
            try {
                val cell = row.getCell(index)
                when (cell?.cellType) {
                    CellType.STRING -> cell.stringCellValue
                    CellType.NUMERIC -> cell.numericCellValue.toString()
                    CellType.BOOLEAN -> cell.booleanCellValue.toString()
                    CellType.FORMULA -> {
                        when (cell.cachedFormulaResultType) {
                            CellType.STRING -> cell.stringCellValue
                            CellType.NUMERIC -> cell.numericCellValue.toString()
                            else -> ""
                        }
                    }
                    else -> ""
                }
            } catch (e: Exception) {
                logger.warn("Erro ao ler célula na coluna $index", e)
                ""
            }
        }
    }

    private fun createFuncionario(fields: List<String>): Funcionario {
        require(fields.size >= 8) { "Número insuficiente de campos" }
        
        return Funcionario(
            nome = fields[0].trim(),
            email = fields[1].trim(),
            time = fields[2].trim(),
            mesEntrada = fields[3].trim(),
            fabrica = fields[4].trim(),
            senioridade = fields[5].trim(),
            cargo = fields[6].trim(),
            modelo = fields[7].trim()
        )
    }

    private fun isCsvFile(filename: String?): Boolean {
        return filename?.lowercase()?.endsWith(".csv") == true
    }

    private fun isExcelFile(filename: String?): Boolean {
        return filename?.lowercase()?.let { name ->
            name.endsWith(".xlsx") || name.endsWith(".xls")
        } == true
    }
} 