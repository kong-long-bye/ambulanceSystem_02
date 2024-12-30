package org.com.ambulancesystem.service;

import org.com.ambulancesystem.entity.Ambulance;
import org.com.ambulancesystem.entity.AmbulanceStatus;
import org.com.ambulancesystem.repository.AmbulanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AmbulanceService {
    
    @Autowired
    private AmbulanceRepository ambulanceRepository;
    
    public Ambulance updateAmbulanceStatus(Integer ambulanceId, AmbulanceStatus status) {
        Ambulance ambulance = ambulanceRepository.findById(ambulanceId)
                .orElseThrow(() -> new RuntimeException("未找到指定救护车"));
        ambulance.setStatus(status);
        ambulance.setLastAssigned(LocalDateTime.now());
        return ambulanceRepository.save(ambulance);
    }
    
    public List<Ambulance> findByStatus(AmbulanceStatus status) {
        return ambulanceRepository.findByStatus(status);
    }
    
    public List<Ambulance> findByPlateNumber(String plateNumber) {
        return ambulanceRepository.findByPlateNumberContaining(plateNumber);
    }
    
    public List<Ambulance> findAll() {
        return ambulanceRepository.findAll();
    }
} 