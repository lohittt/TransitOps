package com.example.transitops.vehicle.controller;

import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.vehicle.dto.DocumentResponse;
import com.example.transitops.vehicle.entity.Document;
import com.example.transitops.vehicle.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/vehicles")
@Tag(name = "Vehicle Documents", description = "Document management for vehicles")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/{vehicleId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a document for a vehicle")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @PathVariable Long vehicleId,
            @RequestParam("file") MultipartFile file) {
        DocumentResponse response = documentService.uploadDocument(vehicleId, file);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{vehicleId}/documents")
    @Operation(summary = "Get all documents for a vehicle")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getVehicleDocuments(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocumentsByVehicleId(vehicleId)));
    }

    @GetMapping("/documents/{documentId}/download")
    @Operation(summary = "Download a document")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) throws FileNotFoundException {
        Resource resource = documentService.loadFileAsResource(documentId);
        Document document = documentService.getDocument(documentId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/documents/{documentId}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long documentId) {
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
