package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class DuplicateEmailException extends CustomRuntimeException {
    public DuplicateEmailException(){
        super("email.duplicate");
    }
    public DuplicateEmailException(String msg){
        super(msg);
    }
}
