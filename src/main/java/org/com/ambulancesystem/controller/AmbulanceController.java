package org.com.ambulancesystem.controller;

import org.com.ambulancesystem.common.Result;
import org.com.ambulancesystem.entity.Ambulance;
import org.com.ambulancesystem.entity.AmbulanceStatus;
import org.com.ambulancesystem.service.AmbulanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {
    
    @Autowired
    private AmbulanceService ambulanceService;
    
    @PutMapping("/{id}/status")
    public Result<Ambulance> updateStatus(
            @PathVariable("id") Integer ambulanceId,
            @RequestParam AmbulanceStatus status) {
        try {
            Ambulance ambulance = ambulanceService.updateAmbulanceStatus(ambulanceId, status);
            return Result.success("状态更新成功", ambulance);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
    
    @GetMapping
    public Result<List<Ambulance>> getAmbulances(
            @RequestParam(required = false) AmbulanceStatus status,
            @RequestParam(required = false) String plateNumber) {
        try {
            List<Ambulance> ambulances;
            if (status != null) {
                ambulances = ambulanceService.findByStatus(status);
            } else if (plateNumber != null && !plateNumber.isEmpty()) {
                ambulances = ambulanceService.findByPlateNumber(plateNumber);
            } else {
                ambulances = ambulanceService.findAll();
            }
            return Result.success(ambulances);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }
} 