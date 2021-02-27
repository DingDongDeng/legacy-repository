package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.domain.dto.PasswordDTO;
import com.board.portfolio.validation.anotation.PasswordCompare;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class PasswordCompareValidator implements ConstraintValidator<PasswordCompare, PasswordDTO> {
    @Override
    public boolean isValid(PasswordDTO dto, ConstraintValidatorContext cxt) {
        String password = dto.getPassword();
        String passwordCheck = dto.getPasswordCheck();
        return password.equals(passwordCheck);
    }
}