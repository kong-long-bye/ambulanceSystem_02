package org.com.ambulancesystem.repository;

import org.com.ambulancesystem.entity.Ambulance;
import org.com.ambulancesystem.entity.AmbulanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmbulanceRepository extends JpaRepository<Ambulance, Integer> {
    List<Ambulance> findByStatus(AmbulanceStatus status);
    List<Ambulance> findByPlateNumberContaining(String plateNumber);
} 