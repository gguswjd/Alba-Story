package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "workplaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Workplace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workplace_id")
    private Long workplaceId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "work_name", nullable = false, unique = true, length = 100)
    private String workName;

    @Column(length = 255)
    private String address;

    @Column(name = "reg_number", length = 50)
    private String regNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkplaceStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum WorkplaceStatus {
        active, inactive
    }
}
