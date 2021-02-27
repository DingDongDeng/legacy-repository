package com.board.portfolio.exception.custom;

import lombok.Getter;

@Getter
public class NotFoundAlarmException extends CustomRuntimeException {
    public NotFoundAlarmException(){
        super("alarm.exist");
    }
    public NotFoundAlarmException(String msg){
        super(msg);
    }
}
