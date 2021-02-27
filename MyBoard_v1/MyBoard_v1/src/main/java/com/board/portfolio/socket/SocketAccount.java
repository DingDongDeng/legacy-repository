package com.board.portfolio.socket;

import com.board.portfolio.domain.entity.AccountRole;
import lombok.Data;

import java.util.Date;

@Data
public class SocketAccount {
    private String email;
    private String nickname;
    private Date signUpDate;
    private AccountRole role;
    private String socialId;
    private String authKey;
    private boolean isAuth;
}
