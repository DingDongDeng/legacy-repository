package com.board.portfolio.security.cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Component
public class JwtCookieUtil {
    private static String jwtTokenName;
    private static String path;
    private static int maxAge;

    @Autowired
    public JwtCookieUtil(@Value("${jwt.cookie.name}") String jwtTokenName,
                         @Value("${jwt.cookie.path}") String path,
                         @Value("${jwt.cookie.max-age}") String maxAge){
        this.jwtTokenName = jwtTokenName;
        this.path = path;
        this.maxAge = Integer.parseInt(maxAge);
    }

    public static String getJwtCookieValue(HttpServletRequest req){
        Cookie cookie = findJwtCookie(req.getCookies()).orElse(new Cookie(jwtTokenName,""));
        return cookie.getValue();
    }
    public static Cookie createSignOutCookie(){
        Cookie cookie = new Cookie(jwtTokenName,"");
        cookie.setMaxAge(0);
        cookie.setPath(path);
        return cookie;
    }
    public static Cookie createSignInCookie(String jwt){
        Cookie cookie = new Cookie(jwtTokenName, jwt);
        cookie.setPath(path);
        cookie.setMaxAge(maxAge);
        return cookie;
    }

    private static Optional<Cookie> findJwtCookie(Cookie[] cookies){
        Cookie jwtCookie=null;
        if(cookies==null){
            return Optional.ofNullable(jwtCookie);
        }
        for(Cookie cookie : cookies){
            if(cookie.getName().equals(jwtTokenName)){
                jwtCookie = cookie;
            }
        }
        return Optional.ofNullable(jwtCookie);

    }

}
