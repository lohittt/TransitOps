package com.example.transitops.vehicle.service;

import com.example.transitops.vehicle.dto.DocumentResponse;
import com.example.transitops.vehicle.entity.Document;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.repository.DocumentRepository;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final VehicleRepository vehicleRepository;
    private final Path fileStorageLocation;

    public DocumentService(DocumentRepository documentRepository, VehicleRepository vehicleRepository) {
        this.documentRepository = documentRepository;
        this.vehicleRepository = vehicleRepository;
        
        this.fileStorageLocation = Paths.get("uploads/documents").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public DocumentResponse uploadDocument(Long vehicleId, MultipartFile file) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            if (originalFileName.contains("..")) {
                throw new IllegalArgumentException("Filename contains invalid path sequence " + originalFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();
            document.setFileName(originalFileName);
            document.setFileType(file.getContentType());
            document.setFilePath(targetLocation.toString());
            document.setUploadDate(LocalDateTime.now());
            document.setVehicle(vehicle);

            document = documentRepository.save(document);
            return mapToResponse(document);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public List<DocumentResponse> getDocumentsByVehicleId(Long vehicleId) {
        return documentRepository.findByVehicleId(vehicleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Resource loadFileAsResource(Long documentId) throws FileNotFoundException {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new FileNotFoundException("Document not found"));
                
        try {
            Path filePath = Paths.get(document.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found " + document.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("File not found " + document.getFileName());
        }
    }
    
    public Document getDocument(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
    }

    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
                
        try {
            Path filePath = Paths.get(document.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file", ex);
        }
        
        documentRepository.delete(document);
    }

    private DocumentResponse mapToResponse(Document document) {
        String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/vehicles/documents/")
                .path(document.getId().toString())
                .path("/download")
                .toUriString();

        return DocumentResponse.builder()
                .id(document.getId())
                .vehicleId(document.getVehicle().getId())
                .fileName(document.getFileName())
                .fileType(document.getFileType())
                .uploadDate(document.getUploadDate())
                .downloadUrl(downloadUrl)
                .build();
    }
}
