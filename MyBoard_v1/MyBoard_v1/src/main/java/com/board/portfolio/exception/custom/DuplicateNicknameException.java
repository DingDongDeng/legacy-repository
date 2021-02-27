package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class DuplicateNicknameException extends CustomRuntimeException {
    public DuplicateNicknameException(){
        super("nickname.duplicate");
    }
    public DuplicateNicknameException(String msg){
        super(msg);
    }
}
