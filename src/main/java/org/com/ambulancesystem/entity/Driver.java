package org.com.ambulancesystem.entity;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "driver")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer driverId;
    
    private String name;
    
    private String phoneNumber;
} 