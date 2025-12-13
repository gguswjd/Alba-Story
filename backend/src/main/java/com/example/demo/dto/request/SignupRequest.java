package com.example.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 5, message = "이름은 5자 이하여야 합니다")
    private String name;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Size(max = 30, message = "이메일은 30자 이하여야 합니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 6, max = 20, message = "비밀번호는 6자 이상 20자 이하여야 합니다")
    private String password;

    @Size(max = 12, message = "전화번호는 11자 이하여야 합니다")
    private String phone;

    @NotBlank(message = "역할은 필수입니다")
    private String role; // admin, owner, employee 중 하나
}
