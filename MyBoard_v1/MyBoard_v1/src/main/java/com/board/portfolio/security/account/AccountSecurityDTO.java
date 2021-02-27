package com.board.portfolio.security.account;

import com.board.portfolio.domain.entity.AccountRole;
import lombok.Data;

import java.util.Date;

@Data
public class AccountSecurityDTO {
    private String email;
    private String password;
    private String nickname;
    private Date signUpDate;
    private AccountRole role;
    private boolean isSocial;
    private String authKey;
    private boolean isAuth;

    private String jwtToken;

    public AccountSecurityDTO(){

    }

    public AccountSecurityDTO(String email,String nickname, AccountRole role,boolean isSocial, String jwtToken) {
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.isSocial = isSocial;
        this.jwtToken = jwtToken;
    }
}
