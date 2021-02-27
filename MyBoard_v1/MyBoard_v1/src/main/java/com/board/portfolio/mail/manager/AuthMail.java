package com.board.portfolio.mail.manager;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthMail {
    private String email;
    private LocalDateTime sendDate;
    private String authKey;

    public long getSendDateMillis(){
        LocalDateTime localDateTime = this.sendDate; // implementation details
        ZonedDateTime zdt = ZonedDateTime.of(localDateTime, ZoneId.systemDefault());
        return zdt.toInstant().toEpochMilli();
    }
}
