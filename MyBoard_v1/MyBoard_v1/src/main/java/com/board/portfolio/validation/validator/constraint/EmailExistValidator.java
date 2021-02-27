package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.repository.AccountRepository;
import com.board.portfolio.validation.anotation.EmailExist;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class EmailExistValidator implements ConstraintValidator<EmailExist, String> {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void initialize(EmailExist emailExist) {
    }
    @Override
    public boolean isValid(String email, ConstraintValidatorContext cxt) {
        boolean isExistEmail = accountRepository.existsByEmail(email);
        return isExistEmail;
    }
}