package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.repository.AccountRepository;
import com.board.portfolio.validation.anotation.AuthKeyExist;
import com.board.portfolio.validation.anotation.EmailExist;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class AuthKeyExistValidator implements ConstraintValidator<AuthKeyExist, String> {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void initialize(AuthKeyExist authKeyExist) {
    }
    @Override
    public boolean isValid(String authKey, ConstraintValidatorContext cxt) {
        boolean isExistAuthKey = accountRepository.existsByAuthKey(authKey);
        return isExistAuthKey;
    }
}