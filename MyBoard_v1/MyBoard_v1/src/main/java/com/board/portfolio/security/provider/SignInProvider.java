package com.board.portfolio.security.provider;


import com.board.portfolio.security.account.AccountDetails;
import com.board.portfolio.security.account.AccountDetailsService;
import com.board.portfolio.security.token.SignInPreToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SignInProvider implements AuthenticationProvider {
    private final AccountDetailsService detailsService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        SignInPreToken token = (SignInPreToken) authentication;
        AccountDetails details = (AccountDetails) detailsService.loadUserByUsername(token.getEmail());
        details.validatePreToken(token,passwordEncoder);
        return details.getPostToken(details);
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return SignInPreToken.class.isAssignableFrom(aClass) ;
    }
}
