package com.board.portfolio.domain.entity;


import lombok.Getter;

@Getter
public enum AccountRole {
    MEMBER("ROLE_MEMBER"),
    ADMIN("ROLE_ADMIN");

    private String roleName;
    AccountRole(String roleName){
        this.roleName = roleName;
    }
}
