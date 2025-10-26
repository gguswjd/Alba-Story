package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class WorkJoinRequestResponse {
    private Long requestId;
    private Long userId;
    private String userName;
    private Long workplaceId;
    private String workplaceName;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime respondedAt;
}
