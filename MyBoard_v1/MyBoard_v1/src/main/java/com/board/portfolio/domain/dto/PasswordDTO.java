package com.board.portfolio.domain.dto;

import com.board.portfolio.validation.anotation.PasswordCompare;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
@PasswordCompare(message = "{password.compare}")
public class PasswordDTO {
    @NotBlank(message = "{password.not.blank}")
    @Pattern(regexp ="^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$"
            ,message = "{password.pattern}")//영문,숫자,특문 8글자 이상
    private String password;
    @NotBlank(message = "{passwordCheck.not.blank}")
    private String passwordCheck;
}
