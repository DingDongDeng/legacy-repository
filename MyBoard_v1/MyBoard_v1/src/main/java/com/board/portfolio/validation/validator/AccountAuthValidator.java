package com.board.portfolio.validation.validator;

import com.board.portfolio.domain.dto.AccountDTO;
import com.board.portfolio.exception.custom.AleadyAuthenticatedException;
import com.board.portfolio.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class AccountAuthValidator implements Validator {
    @Autowired
    AccountRepository accountRepository;

    @Override
    public boolean supports(Class<?> aClass) {
        return AccountDTO.Auth.class.isAssignableFrom(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        AccountDTO.Auth dto = (AccountDTO.Auth) o;
        boolean isAuth = accountRepository.existsByEmailAndAuthKeyAndIsAuth(dto.getEmail(), dto.getAuthKey(),true);
        if(isAuth){
            throw new AleadyAuthenticatedException();
        }

    }
}
