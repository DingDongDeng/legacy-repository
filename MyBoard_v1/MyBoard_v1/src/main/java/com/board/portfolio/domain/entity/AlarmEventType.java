package com.board.portfolio.domain.entity;


import lombok.Getter;

@Getter
public enum AlarmEventType {
    LIKE_COMMENT,
    LIKE_BOARD,
    WRITE_COMMENT,
    REPLY_COMMENT;
}
