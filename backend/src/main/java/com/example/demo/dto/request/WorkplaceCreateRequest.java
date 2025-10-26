package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkplaceCreateRequest {
    @NotBlank(message = "근무지 이름은 필수입니다")
    private String workName;

    private String address;

    @NotBlank(message = "사업자등록번호는 필수입니다")
    private String regNumber;
}
