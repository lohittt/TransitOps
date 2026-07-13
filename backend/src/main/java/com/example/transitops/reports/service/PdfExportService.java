package com.example.transitops.reports.service;

import com.example.transitops.reports.dto.FuelEfficiencyResponse;
import com.example.transitops.reports.dto.VehicleROIResponse;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfExportService {

    private final ReportService reportService;

    public PdfExportService(ReportService reportService) {
        this.reportService = reportService;
    }

    public byte[] generateFleetReportPdf() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("TransitOps - Fleet Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Vehicle ROI Table
            document.add(new Paragraph("Vehicle ROI", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(Chunk.NEWLINE);
            PdfPTable roiTable = new PdfPTable(5);
            roiTable.setWidthPercentage(100);
            
            addTableHeader(roiTable, "Vehicle", "Cost", "Revenue", "Completed Trips", "ROI Score");
            
            List<VehicleROIResponse> roiData = reportService.getVehicleROI();
            for (VehicleROIResponse row : roiData) {
                roiTable.addCell(row.getVehicleName() + " (" + row.getRegistrationNumber() + ")");
                roiTable.addCell(String.format("$%.2f", row.getTotalOperationalCost()));
                roiTable.addCell(String.format("$%.2f", row.getTotalRevenue()));
                roiTable.addCell(String.valueOf(row.getCompletedTrips()));
                roiTable.addCell(String.format("%.2f", row.getRoiScore()));
            }
            document.add(roiTable);
            document.add(Chunk.NEWLINE);

            // Fuel Efficiency Table
            document.add(new Paragraph("Fuel Efficiency", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(Chunk.NEWLINE);
            PdfPTable fuelTable = new PdfPTable(4);
            fuelTable.setWidthPercentage(100);
            
            addTableHeader(fuelTable, "Vehicle", "Distance (km)", "Fuel (L)", "Efficiency (km/L)");
            
            List<FuelEfficiencyResponse> fuelData = reportService.getFuelEfficiency();
            for (FuelEfficiencyResponse row : fuelData) {
                fuelTable.addCell(row.getVehicleName());
                fuelTable.addCell(String.format("%.2f", row.getTotalDistanceKm()));
                fuelTable.addCell(String.format("%.2f", row.getTotalLiters()));
                fuelTable.addCell(String.format("%.2f", row.getKmPerLiter()));
            }
            document.add(fuelTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            table.addCell(cell);
        }
    }
}
