package com.board.portfolio.security.social;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.AccountRole;
import com.board.portfolio.repository.AccountRepository;
import com.board.portfolio.security.account.AccountSecurityDTO;
import com.board.portfolio.security.cookie.JwtCookieUtil;
import com.board.portfolio.security.jwt.JwtFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.Map;

import static com.board.portfolio.util.StaticUtils.modelMapper;

@RequiredArgsConstructor
@Component
public class ApplicationOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final AccountRepository accountRepository;
    private final JwtFactory jwtFactory;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();  //현재 로그인 진행중인 서비스를 구분하는 코드
        String userNameAttribueName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName(); //OAuth2 로그인 진행시 키가되는 필드

        Map attributes = oAuth2User.getAttributes();

        Account account = saveOrUpdate(new OAuthAttributes(registrationId, attributes));
        responseJwtToken(account);
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(account.getRole().getRoleName())),
                attributes,userNameAttribueName);
    }

    private Account saveOrUpdate(OAuthAttributes attributes){
        String email = attributes.getEmail();
        Account account = accountRepository.findById(email).orElse(
                Account.builder()
                        .email(email)
                        .role(AccountRole.MEMBER)
                        .isSocial(true)
                        .isAuth(true)
                        .build()
        );
        account.setAuth(true);
        return accountRepository.save(account);
    }
    private void responseJwtToken(Account account){
        HttpServletResponse res = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();

        String jwt = jwtFactory.generateToken(modelMapper.map(account, AccountSecurityDTO.class));
        res.addCookie(JwtCookieUtil.createSignInCookie(jwt));
    }
}
