package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class InvalidJwtException extends CustomRuntimeException {
    public InvalidJwtException(){
        super("jwt.invalid");
    }
    public InvalidJwtException(String msg){
        super(msg);
    }
}
