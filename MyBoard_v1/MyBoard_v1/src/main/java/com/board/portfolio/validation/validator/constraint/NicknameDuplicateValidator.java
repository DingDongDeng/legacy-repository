package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.repository.AccountRepository;
import com.board.portfolio.validation.anotation.NicknameDuplicate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class NicknameDuplicateValidator implements ConstraintValidator<NicknameDuplicate, String> {
    private final AccountRepository accountRepository;
    @Override
    public void initialize(NicknameDuplicate nicknameDuplicate) {
    }
    @Override
    public boolean isValid(String nickname, ConstraintValidatorContext cxt) {
        boolean isExistEmail = accountRepository.existsByNickname(nickname);
        return !isExistEmail;
    }
}