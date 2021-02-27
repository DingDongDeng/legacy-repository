package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class NotCorrectPasswordException extends FieldException {
    public NotCorrectPasswordException(String rejectedValue){
        super("password.not.correct","nowPassword",rejectedValue);
    }
    public NotCorrectPasswordException(String msg, String rejectedValue){
        super(msg, rejectedValue);
    }
}
