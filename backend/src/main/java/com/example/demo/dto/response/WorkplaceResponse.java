package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class WorkplaceResponse {
    private Long workplaceId;
    private String workName;
    private String address;
    private String regNumber;
    private String status;
    private LocalDateTime createdAt;
}
