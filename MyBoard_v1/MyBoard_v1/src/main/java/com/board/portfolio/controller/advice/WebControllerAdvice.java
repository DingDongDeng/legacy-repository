package com.board.portfolio.controller.advice;

import com.board.portfolio.security.account.AccountSecurityDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@Slf4j
@RestControllerAdvice
public class WebControllerAdvice {
    @ModelAttribute("accountDTO")
    private AccountSecurityDTO getAccountDTO(Authentication authentication){
        if(authentication==null)
            return new AccountSecurityDTO();
        if(authentication.getPrincipal().equals("")){
            return new AccountSecurityDTO();
        }
        return (AccountSecurityDTO)authentication.getPrincipal();
    }
}
