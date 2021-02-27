package com.board.portfolio.validation.validator;

import com.board.portfolio.domain.dto.AccountDTO;
import com.board.portfolio.exception.custom.NotSamePasswordException;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class AccountSignUpValidator implements Validator {
    @Override
    public boolean supports(Class<?> aClass) {
        return AccountDTO.SignUp.class.isAssignableFrom(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        AccountDTO.SignUp dto = (AccountDTO.SignUp) o;
        if(!isValidPassword(dto)){
            throw new NotSamePasswordException();
        }

    }

    private boolean isValidPassword(AccountDTO.SignUp dto){
        String password = dto.getPassword();
        String passwordCheck = dto.getPasswordCheck();
        if(!password.equals(passwordCheck)){
            return false;
        }
        return true;
    }

}
