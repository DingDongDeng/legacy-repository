package com.board.portfolio.security.account;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.AccountRole;
import com.board.portfolio.security.exception.BlankEmailException;
import com.board.portfolio.security.exception.BlankPasswordException;
import com.board.portfolio.security.exception.FailSignInException;
import com.board.portfolio.security.exception.InvalidAuthAccountException;
import com.board.portfolio.security.token.SignInPostToken;
import com.board.portfolio.security.token.SignInPreToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static com.board.portfolio.util.StaticUtils.modelMapper;

public class AccountDetails extends User {

    private AccountSecurityDTO account;

    private void saveAccount(Account account){
        this.account = modelMapper.map(account, AccountSecurityDTO.class);
    }

    public AccountDetails(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public static AccountDetails transFromAccountWithSave(Account account){
        AccountDetails detail = new AccountDetails(account.getEmail(), account.getPassword(), parseAuthorities(account.getRole()));
        detail.saveAccount(account);
        return detail;
    }
    private static AccountRole parseAccountRole(String roleName){
        return AccountRole.valueOf(roleName);
    }
    public static List<SimpleGrantedAuthority> parseAuthoritiesFromRoleName(String roleName){
        return  parseAuthorities(parseAccountRole(roleName));
    }
    private static List<SimpleGrantedAuthority> parseAuthorities(AccountRole role) {
        return Arrays.asList(role).stream().map(r -> new SimpleGrantedAuthority(r.getRoleName())).collect(Collectors.toList());
    }

    public void validatePreToken(SignInPreToken token,PasswordEncoder passwordEncoder){
        String email = token.getEmail();
        String password = token.getPassword();
        validateSignIn(email,password,passwordEncoder);
    }

    private void validateSignIn(String email, String password, PasswordEncoder passwordEncoder){
        if(!this.account.isAuth()){
            throw new InvalidAuthAccountException();
        }
        if(email.equals("") || email == null){
            throw new BlankEmailException();
        }
        if(password.equals("") || password == null){
            throw new BlankPasswordException();
        }
        if(isAbleSignIn(email, password, passwordEncoder)){
            throw new FailSignInException();
        }
    }

    private boolean isAbleSignIn(String email, String password, PasswordEncoder passwordEncoder){
        return !(isSameEmail(email)&&isSamePassword(password,passwordEncoder));
    }
    private boolean isSameEmail(String email){
        return email.equals(this.getEmail());
    }
    private boolean isSamePassword(String password, PasswordEncoder passwordEncoder){
        return passwordEncoder.matches(password, this.getPassword());
    }

    public String getEmail(){
        return (String) super.getUsername();
    }
    public String getPassword(){
        return (String) super.getPassword();
    }
    public AccountSecurityDTO getAccount(){
        return this.account;
    }

    public SignInPostToken getPostToken(AccountDetails details) {
        return new SignInPostToken(details.getAccount(), details.getPassword(), details.getAuthorities() );
    }
    public static SignInPostToken getPostToken(DecodedJWT decodedJWT){
        String email = decodedJWT.getClaim("email").asString();
        String nickname = decodedJWT.getClaim("nickname").asString();
        AccountRole role = decodedJWT.getClaim("role").as(AccountRole.class);
        boolean isSocial = decodedJWT.getClaim("isSocial").asBoolean();
        return new SignInPostToken(new AccountSecurityDTO(email,nickname, role, isSocial, decodedJWT.getToken()), parseAuthorities(role));
    }
}
