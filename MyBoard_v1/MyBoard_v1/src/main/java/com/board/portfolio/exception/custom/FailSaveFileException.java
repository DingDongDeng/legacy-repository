package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class FailSaveFileException extends CustomRuntimeException {
    public FailSaveFileException(){
        super("file.fail.save");
    }
    public FailSaveFileException(String msg){
        super(msg);
    }
}
