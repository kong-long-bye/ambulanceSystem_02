package org.com.ambulancesystem.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ambulance")
public class Ambulance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ambulanceId;
    
    private String plateNumber;
    
    @Enumerated(EnumType.STRING)
    private AmbulanceStatus status;
    
    private LocalDateTime lastAssigned;
    
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;
} 