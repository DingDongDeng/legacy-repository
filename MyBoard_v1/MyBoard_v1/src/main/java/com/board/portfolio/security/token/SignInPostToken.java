package com.board.portfolio.security.token;

import com.board.portfolio.security.account.AccountDetails;
import com.board.portfolio.security.account.AccountSecurityDTO;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class SignInPostToken extends UsernamePasswordAuthenticationToken {

    public SignInPostToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }
    public SignInPostToken(Object principal, Collection<? extends GrantedAuthority> authorities){
        super(principal, null, authorities);
    }

    public String getEmail(){
        return (String)super.getPrincipal();
    }
    public String getPassword(){
        return (String)super.getCredentials();
    }


    public AccountSecurityDTO getAccountSecurityDTO() {
        return (AccountSecurityDTO) super.getPrincipal();
    }

    public AccountDetails getAccountDetails(){
        return new AccountDetails(this.getEmail(), this.getPassword(), super.getAuthorities());
    }
}
