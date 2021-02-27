package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class BlankPasswordException extends CustomRuntimeException {
    public BlankPasswordException(){
        super("password.not.blank");
    }
    public BlankPasswordException(String msg){
        super(msg);
    }
}
