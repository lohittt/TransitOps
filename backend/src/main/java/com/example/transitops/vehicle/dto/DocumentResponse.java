package com.example.transitops.vehicle.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DocumentResponse {
    private Long id;
    private Long vehicleId;
    private String fileName;
    private String fileType;
    private LocalDateTime uploadDate;
    private String downloadUrl;
}
