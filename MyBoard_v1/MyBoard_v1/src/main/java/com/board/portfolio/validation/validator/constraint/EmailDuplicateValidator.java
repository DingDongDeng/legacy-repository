package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.repository.AccountRepository;
import com.board.portfolio.validation.anotation.EmailDuplicate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class EmailDuplicateValidator implements ConstraintValidator<EmailDuplicate, String> {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void initialize(EmailDuplicate emailDuplicate) {
    }
    @Override
    public boolean isValid(String email, ConstraintValidatorContext cxt) {
        boolean isExistEmail = accountRepository.existsByEmail(email);
        return !isExistEmail;
    }
}